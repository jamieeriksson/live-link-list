import datetime as dt
import os

import dj_database_url

try:
    from dotenv import load_dotenv

    load_dotenv()
except ImportError:
    pass

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))

SECRET_KEY = os.getenv("DJANGO_SECRET_KEY")
DEBUG = os.getenv("DJANGO_DEBUG") == "TRUE"
ALLOWED_HOSTS = ["live-link-list.herokuapp.com", "localhost", "127.0.0.1"]


# Application definition

INSTALLED_APPS = [
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "corsheaders",
    "rest_framework",
    "rest_framework_simplejwt.token_blacklist",
    "django_filters",
    "phonenumber_field",
    "django_rq",
    "livelinklist.users.apps.UsersConfig",
    "livelinklist.lives.apps.LivesConfig",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "livelinklist.urls"
WSGI_APPLICATION = "livelinklist.wsgi.application"

# SSL

SECURE_BROWSER_XSS_FILTER = True
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SECURE_SSL_REDIRECT = not DEBUG
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000


# Database

DATABASES = {"default": dj_database_url.config(conn_max_age=500)}
DATABASES["default"]["ATOMIC_REQUESTS"] = True

# Users

AUTH_USER_MODEL = "users.User"


# Password validation

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
        "OPTIONS": {
            "min_length": 8,
        },
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_L10N = True
USE_TZ = True


# Logging

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {
            "level": "INFO",
            "class": "logging.StreamHandler",
        },
    },
    "loggers": {
        "django": {
            "handlers": ["console"],
            "propagate": True,
        },
        "django.db.backends": {
            "level": "INFO",
            "handlers": ["console"],
            "propagate": True,
        },
    },
}

# Django REST Framework

REST_FRAMEWORK = {
    "DEFAULT_RENDERER_CLASSES": ("rest_framework.renderers.JSONRenderer",),
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_FILTER_BACKENDS": ("django_filters.rest_framework.DjangoFilterBackend",),
    "TEST_REQUEST_DEFAULT_FORMAT": "json",
}


# Simple JWT

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": dt.timedelta(minutes=5),
    "REFRESH_TOKEN_LIFETIME": dt.timedelta(days=14),
    "ROTATE_REFRESH_TOKENS": True,
    "AUTH_HEADER_TYPES": ("Bearer",),
    "AUTH_HEADER_NAME": "HTTP_AUTHORIZATION",
}


# django-cors-headers

CORS_ALLOWED_ORIGIN_REGEXES = [
    r"^https://livelinklist\.com$",
    r"^https://www.livelinklist\.com$",
    r"^https://(deploy-preview-[\d]+--)?livelinklist\.netlify\.app$",
    r"^http://localhost:3000$",
]

CORS_ALLOW_HEADERS = [
    "HTTP_AUTHORIZATION",
    "AUTHORIZATION",
    "http_authorization",
    "Content-Type",
    "Access-Control-Allow-Methods",
    "Access-Control-Allow-Origin",
    "Access-Control-Allow-Headers",
]

# Email Settings

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = "smtp.localhost"
EMAIL_PORT = "8000"
EMAIL_HOST_USER = "noreply@livelinklist.com"
EMAIL_HOST_PASSWORD = "password123"
EMAIL_USE_TLS = True
EMAIL_USE_SSL = False

SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY")

# Django RQ

RQ_QUEUES = {
    "default": {
        "HOST": "localhost",
        "PORT": 6379,
        "DB": 0,
        "PASSWORD": "",
        "DEFAULT_TIMEOUT": 360,
    },
    # "with-sentinel": {
    #     "SENTINELS": [("localhost", 26736), ("localhost", 26737)],
    #     "MASTER_NAME": "redismaster",
    #     "DB": 0,
    #     "PASSWORD": "secret",
    #     "SOCKET_TIMEOUT": None,
    #     "CONNECTION_KWARGS": {"socket_connect_timeout": 0.3},
    # },
    "high": {
        "URL": os.getenv(
            "REDISTOGO_URL", "redis://localhost:6379/0"
        ),  # If you're on Heroku
        "DEFAULT_TIMEOUT": 500,
    },
    "low": {
        "HOST": "localhost",
        "PORT": 6379,
        "DB": 0,
    },
}

# RQ_EXCEPTION_HANDLERS = ['path.to.my.handler'] # If you need custom exception handlers
