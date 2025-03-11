"""
Test cases for the models.
"""

from django.contrib.auth import get_user_model
from django.db import IntegrityError
from django.test import TestCase

from users.models import Customer


class ModelTests(TestCase):
    """Test models."""

    def test_create_user_with_email_successful(self):
        """Test creating a new user with an email is successful."""
        username = "testuser"
        email = "test@example.com"
        password = "testpass123"
        user = get_user_model().objects.create_user(
            username=username,
            email=email,
            password=password
        )

        self.assertEqual(user.email, email)
        self.assertTrue(user.check_password(password))

    def test_new_user_email_normalized(self):
        """Test the email for a new user is normalized."""

        sample_emails = [
            ['test1@EXAMPLE.com', 'test1@example.com'],
            ['Test2@Example.com', 'Test2@example.com'],
            ['TEST3@EXAMPLE.com', 'TEST3@example.com'],
            ['test4@example.COM', 'test4@example.com'],
        ]
        username = 'testuser'
        password = 'sample123'

        for email, expected in sample_emails:
            user = get_user_model().objects.create_user(username, email, password)
            self.assertEqual(user.email, expected)
            get_user_model().objects.get(email=user.email).delete()

    def test_new_user_unique_email(self):
        """Test creating a new user with an already existing email."""
        username = "testuser"
        email = "test@example.com"
        password = "testpass123"
        get_user_model().objects.create_user(
            username=username,
            email=email,
            password=password
        )

        with self.assertRaises(IntegrityError):
            get_user_model().objects.create_user(
                username=username,
                email=email,
                password=password
            )

    def test_new_user_invalid_email(self):
        """Test creating user with no email raises error."""

        with self.assertRaises(ValueError):
            get_user_model().objects.create_user('testuser', None, 'sample123')

    def test_create_new_superuser(self):
        """Test creating a new superuser."""

        user = get_user_model().objects.create_superuser(
            'testuser',
            'test@example.com',
            'test123'
        )

        self.assertTrue(user.is_superuser)
        self.assertTrue(user.is_staff)

    def test_create_customer_with_signal(self):
        """Test creating a new customer automatically when creating a user."""

        username = "testuser"
        email = "test@example.com"
        password = "testpass123"
        user = get_user_model().objects.create_user(
            username=username,
            email=email,
            password=password
        )

        customer = Customer.objects.get(user=user)
        self.assertEqual(customer.user, user)
        self.assertEqual(customer.user.email, email)
