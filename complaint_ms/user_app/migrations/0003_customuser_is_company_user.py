# Generated by Django 4.0.10 on 2025-05-02 14:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_app', '0002_alter_customuser_is_staff'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='is_company_user',
            field=models.BooleanField(default=False),
        ),
    ]
