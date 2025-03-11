from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):
    """
    Base User model
    An abstract base class implementing a fully featured User model with admin-compliant permissions.
    Email, username and password are required. Other fields are optional.
    """

    email = models.EmailField(
        error_messages={'unique': 'A user with that email already exists.'},
        help_text='Required. 255 characters or fewer. Letters, digits and @/./+/-/_ only.',
        max_length=255,
        unique=True,
        blank=False,
        null=False,
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

    # USERNAME_FIELD - the field that we want to use as the unique identifier for the user
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['password', 'username']
    EMAIL_FIELD = "email"

    def save(self, *args, **kwargs):
        if not self.email:
            raise ValueError("The Email field must be set")
        super().save(*args, **kwargs)


class Customer(models.Model):
    """
    Customer User Model
    Extends the base User model with additional fields related to customers.
    """

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    nif = models.CharField(max_length=9, blank=True, null=True, unique=True, verbose_name=_("NIF"))
    address = models.CharField(max_length=255, blank=True, null=True, verbose_name=_("address"))
    phone = models.CharField(max_length=31, blank=True, null=True, verbose_name=_("phone number"))

    def __str__(self):
        return self.user.email

    class Meta:
        verbose_name = _("customer")
        verbose_name_plural = _("customers")
