from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from django.db.models import Q

from django.contrib.auth import get_user_model
from .models import Resume
from .serializers import (
    UserSerializer, 
    UserDetailSerializer,
    RegisterSerializer, 
    CustomTokenObtainPairSerializer,
    ResumeSerializer
)

User = get_user_model()


class MeView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        user = request.user
        username = request.data.get("username")
        new_password = request.data.get("password")
        bio = request.data.get("bio")
        avatar = request.FILES.get("avatar")

        if username:
            user.username = username

        if new_password and len(new_password) >= 6:
            user.set_password(new_password)

        if bio is not None:
            user.bio = bio

        if avatar:
            user.avatar = avatar

        user.save()
        serializer = UserSerializer(user)
        return Response(serializer.data)


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "id": user.id,
                "email": user.email,
                "username": user.username,
            }, status=201)
        return Response(serializer.errors, status=400)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class ResumeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Get current user's resume"""
        try:
            resume = request.user.resume
        except Resume.DoesNotExist:
            # Create an empty resume if it doesn't exist
            resume = Resume.objects.create(user=request.user)
        serializer = ResumeSerializer(resume)
        return Response(serializer.data)

    def put(self, request):
        """Update current user's resume"""
        try:
            resume = request.user.resume
        except Resume.DoesNotExist:
            # Create an empty resume if it doesn't exist
            resume = Resume.objects.create(user=request.user)
        serializer = ResumeSerializer(resume, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserSearchView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Search for users by username, skills, or location"""
        search = request.query_params.get('search', '')
        skill = request.query_params.get('skill', '')
        location = request.query_params.get('location', '')
        
        users = User.objects.exclude(id=request.user.id).select_related('resume')
        
        # Search by username or email
        if search:
            users = users.filter(
                Q(username__icontains=search) | 
                Q(email__icontains=search)
            )
        
        # Filter by skills in resume
        if skill:
            users = users.filter(resume__skills__icontains=skill)
        
        # Filter by location
        if location:
            users = users.filter(resume__location__icontains=location)
        
        serializer = UserDetailSerializer(users, many=True)
        return Response(serializer.data)


class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        """Get detailed user profile"""
        user = User.objects.get(id=user_id)
        serializer = UserDetailSerializer(user)
        return Response(serializer.data)


class UserReviewsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        """Get reviews for a specific user"""
        user = User.objects.get(id=user_id)
        reviews = user.reviews_received.all()
        
        from apps.reviews.serializers import ReviewSerializer
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)


class SpecialistsListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        """Get list of all specialists (users with resume)"""
        specialists = User.objects.filter(resume__isnull=False).distinct()
        
        # Search by skills, location, or username
        search = request.query_params.get('search', '')
        if search:
            specialists = specialists.filter(
                Q(username__icontains=search) |
                Q(resume__skills__icontains=search) |
                Q(resume__location__icontains=search)
            )
        
        serializer = UserDetailSerializer(specialists, many=True)
        return Response(serializer.data)
