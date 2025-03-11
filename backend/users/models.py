from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Base User model"""
    email = models.EmailField(
        error_messages={'unique': 'A user with that email already exists.'},
        help_text='Required. 255 characters or fewer. Letters, digits and @/./+/-/_ only.',
        max_length=255,
        unique=True,
        blank=False,
        verbose_name="email address"
    )
    is_email_verified = models.BooleanField(
        help_text='Designates whether the email address has been verified.',
        default=False,
        verbose_name='email verified'
    )
    email_hash = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        default=None,
        verbose_name='email verification hash'
    )
    # soft delete
    deleted_at = models.DateTimeField(
        blank=True,
        null=True,
        default=None,
        verbose_name='deleted at'
    )

    # USERNAME_FIELD - the field that we want to use as the unique identifier for the user
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['password', 'username']
    EMAIL_FIELD = "email"
