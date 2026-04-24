from . import settings as base_settings

globals().update(
    {
        key: value
        for key, value in vars(base_settings).items()
        if key.isupper()
    }
)

SECRET_KEY = SECRET_KEY or 'test-secret-key'

# Keep tests self-contained and independent from external Postgres.
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'test_db.sqlite3',
    }
}

PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.MD5PasswordHasher',
]

EMAIL_BACKEND = 'django.core.mail.backends.locmem.EmailBackend'
