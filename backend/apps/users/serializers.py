from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Resume

User = get_user_model()


class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = [
            "id", "title", "summary", "phone", "location", 
            "skills", "experience", "education", "portfolio_url", 
            "created_at", "updated_at"
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class UserSerializer(serializers.ModelSerializer):
    resume = ResumeSerializer(read_only=True)

    class Meta:
        model = User
        fields = ["id", "email", "username", "avatar", "bio", "resume"]
        read_only_fields = ["id", "email"]


class UserDetailSerializer(serializers.ModelSerializer): # для детального отображения профиля с рейтингом и количеством отзывов
    resume = ResumeSerializer(read_only=True)
    avg_rating = serializers.SerializerMethodField()
    total_reviews = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "email", "username", "avatar", "bio", "resume", "avg_rating", "total_reviews"]
        read_only_fields = ["id", "email"]

    def get_avg_rating(self, obj):
        reviews = obj.reviews_received.all()
        if reviews.exists():
            return sum(r.rating for r in reviews) / reviews.count()
        return None

    def get_total_reviews(self, obj):
        return obj.reviews_received.count()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["email", "username", "password", "password_confirm"]

    def validate(self, data):
        if data["password"] != data["password_confirm"]:
            raise serializers.ValidationError("Passwords don't match")
        return data

    def create(self, validated_data):
        validated_data.pop("password_confirm")
        user = User.objects.create_user(**validated_data)
        # Create a default resume for the user
        Resume.objects.create(user=user)
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer): # для добавления информации о пользователе в токен
    username_field = "email"

    @classmethod
    def get_token(cls, user): # добавляем email в токен
        token = super().get_token(user)
        token["email"] = user.email
        return token

    def validate(self, attrs): # добавляем информацию о пользователе в ответ при логине
        data = super().validate(attrs)
        data["user"] = {
            "id": self.user.id,
            "email": self.user.email,
            "username": self.user.username,
            "avatar": self.user.avatar.url if self.user.avatar else None,
            "bio": self.user.bio,
        }
        return data
