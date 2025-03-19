"""
Tests for the Languages API
"""

from django.test import TestCase
from django.urls import NoReverseMatch, reverse
from rest_framework import status
from rest_framework.authentication import get_user_model
from rest_framework.test import APIClient

from books.serializers import LanguageSerializer
from books.models import Language


LANGUAGES_URL = reverse('books:languages-list')


def create_user(email='user@example.com', username="testuser", password='testpass123'):
    """Create and return a sample user."""
    return get_user_model().objects.create_user(
        email=email,
        username=username,
        password=password
    )


class PublicLanguagesApiTest(TestCase):
    """Test unauthenticated access API requests."""

    def setUp(self):
        self.client = APIClient()

    def test_auth_required(self):
        """Test that authentication is required for retrieving languages."""
        res = self.client.get(LANGUAGES_URL)

        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


class PrivateLanguagesApiTest(TestCase):
    """Test authenticated access API requests."""

    def setUp(self):
        self.client = APIClient()
        self.user = create_user()
        self.client.force_authenticate(self.user)

    def test_retrieve_languages(self):
        """Test retrieving languages."""
        Language.objects.create(code='ES')
        Language.objects.create(code='en')

        res = self.client.get(LANGUAGES_URL)

        langauges = Language.objects.all()
        serializer = LanguageSerializer(langauges, many=True)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)

    def test_create_language_not_allowed(self):
        """Test that creating a language is not allowed."""
        payload = {'code': 'es'}
        res = self.client.post(LANGUAGES_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_detail_language_not_exists(self):
        """Test that detail view of a language that does not exist."""
        with self.assertRaises(NoReverseMatch):
            self.client.get(reverse('books:languages-detail', args=[1]))
