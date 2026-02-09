# Generated migration file
# This migration fixes Review model

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('reviews', '0001_initial'),
        ('tasks', '0003_expand_task_model'),
    ]

    operations = [
        migrations.AlterField(
            model_name='review',
            name='task',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reviews', to='tasks.task'),
        ),
        migrations.AlterUniqueTogether(
            name='review',
            unique_together={('task', 'reviewer', 'reviewed_user')},
        ),
    ]

