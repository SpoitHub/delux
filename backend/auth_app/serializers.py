from django.contrib.auth import authenticate
from rest_framework import serializers

from .models import OrganizerProfile, User


# ─── OrganizerProfile ─────────────────────────────────────────────────────────

class OrganizerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganizerProfile
        fields = ['id', 'company_name', 'description', 'created_at']
        read_only_fields = ['id', 'created_at']


# ─── User ─────────────────────────────────────────────────────────────────────

class UserSerializer(serializers.ModelSerializer):
    organizer_profile = OrganizerProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'is_organizer', 'organizer_profile']
        read_only_fields = ['id', 'is_organizer', 'organizer_profile']


# ─── Register ─────────────────────────────────────────────────────────────────

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['email', 'password', 'first_name', 'last_name']

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


# ─── Login ────────────────────────────────────────────────────────────────────

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user = authenticate(email=attrs['email'], password=attrs['password'])
        if not user:
            raise serializers.ValidationError('Invalid email or password.')
        attrs['user'] = user
        return attrs


# ─── Logout ───────────────────────────────────────────────────────────────────

class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()
