# Generated migration

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('orders_app', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Payment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.DecimalField(decimal_places=2, max_digits=12)),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('completed', 'Completed'), ('failed', 'Failed'), ('refunded', 'Refunded')], default='pending', max_length=50)),
                ('payment_method', models.CharField(default='mock_card', max_length=50)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('order', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='payment', to='orders_app.order')),
            ],
        ),
    ]
