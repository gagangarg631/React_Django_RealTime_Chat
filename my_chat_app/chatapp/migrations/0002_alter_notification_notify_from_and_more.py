# Generated by Django 4.0.1 on 2022-01-23 12:44

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('chatapp', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='notification',
            name='notify_from',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='notify_from', to='chatapp.people'),
        ),
        migrations.AlterField(
            model_name='notification',
            name='notify_to',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='notify_to', to='chatapp.people'),
        ),
    ]
