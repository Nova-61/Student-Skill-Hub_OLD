# Generated migration file
# This migration creates Resume model

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Resume',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(blank=True, default='', max_length=255)),
                ('summary', models.TextField(blank=True, default='')),
                ('phone', models.CharField(blank=True, default='', max_length=20)),
                ('location', models.CharField(blank=True, default='', max_length=255)),
                ('skills', models.TextField(blank=True, default='')),
                ('experience', models.TextField(blank=True, default='')),
                ('education', models.TextField(blank=True, default='')),
                ('portfolio_url', models.URLField(blank=True, default='')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='resume', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Resume',
                'verbose_name_plural': 'Resumes',
            },
        ),
    ]

