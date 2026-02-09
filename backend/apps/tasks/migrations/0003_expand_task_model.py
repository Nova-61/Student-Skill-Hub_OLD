# Generated migration file
# This migration adds new fields to Task model

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0002_application'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='city',
            field=models.CharField(blank=True, default='', max_length=100),
        ),
        migrations.AddField(
            model_name='task',
            name='deadline',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='task',
            name='importance',
            field=models.CharField(
                choices=[('low', 'Low'), ('medium', 'Medium'), ('high', 'High'), ('critical', 'Critical')],
                default='medium',
                max_length=20,
            ),
        ),
        migrations.AddField(
            model_name='task',
            name='skills_required',
            field=models.CharField(blank=True, default='', max_length=500),
        ),
        migrations.AddField(
            model_name='task',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
    ]

