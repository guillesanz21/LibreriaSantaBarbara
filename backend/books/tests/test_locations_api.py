"""
Tests for the Locations API
"""

from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.authentication import get_user_model
from rest_framework.test import APIClient

from books.serializers import LocationListSerializer, LocationSerializer
from books.models import Location


LOCATIONS_URL = reverse('books:locations-list')


def get_detail_url(location_id):
    """Create and return an location detail URL."""
    return reverse('books:locations-detail', args=[location_id])


def create_user(email='user@example.com', username="testuser", password='testpass123'):
    """Create and return a sample user."""
    return get_user_model().objects.create_user(
        email=email,
        username=username,
        password=password
    )


class PublicLocationsApiTest(TestCase):
    """Test unauthenticated access API requests."""

    def setUp(self):
        self.client = APIClient()

    def test_auth_required(self):
        """Test that authentication is required for retrieving locations."""
        res = self.client.get(LOCATIONS_URL)

        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


class PrivateLocationsApiTest(TestCase):
    """Test authenticated access API requests."""

    def setUp(self):
        self.client = APIClient()
        self.user = create_user()
        self.client.force_authenticate(self.user)

    def test_retrieve_locations(self):
        """Test retrieving locations."""
        Location.objects.create(name='Wharehouse')
        Location.objects.create(name="Store")

        res = self.client.get(LOCATIONS_URL)

        locations = Location.objects.all()
        serializer = LocationListSerializer(locations, many=True)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)

    def test_retrieve_single_location(self):
        """Test retrieving a single location."""
        loc = Location.objects.create(name='Wharehouse')
        url = get_detail_url(loc.id)

        res = self.client.get(url)

        serializer = LocationSerializer(loc)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)

    def test_retrieve_single_location_not_found(self):
        """Test retrieving a single location that does not exist."""
        url = get_detail_url(999)

        res = self.client.get(url)

        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)

    def test_create_location(self):
        """Test creating a new location."""
        payload = {'name': 'New'}

        res = self.client.post(LOCATIONS_URL, payload)

        exists = Location.objects.filter(
            name=payload['name']
        ).exists()
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertTrue(exists)

    def test_create_location_invalid(self):
        """Test creating a new location with invalid payload."""
        payload = {'name': ''}

        res = self.client.post(LOCATIONS_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_location_unique(self):
        """Test creating a new location with an existing name."""
        Location.objects.create(name='Wharehouse')
        payload = {'name': 'Wharehouse'}

        res = self.client.post(LOCATIONS_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_location(self):
        """Test updating a location."""
        loc = Location.objects.create(name='Wharehouse')
        payload = {'name': 'Store'}
        url = get_detail_url(loc.id)

        res = self.client.patch(url, payload)

        loc.refresh_from_db()
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(loc.name, payload['name'])

    def test_update_location_invalid(self):
        """Test updating a location with invalid payload."""
        loc = Location.objects.create(name='Wharehouse')
        payload = {'name': ''}
        url = get_detail_url(loc.id)

        res = self.client.patch(url, payload)

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_location_unique(self):
        """Test updating a location with an existing name."""
        Location.objects.create(name='Wharehouse')
        loc = Location.objects.create(name="Store")
        payload = {'name': 'Wharehouse'}
        url = get_detail_url(loc.id)

        res = self.client.patch(url, payload)

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_complete_location_unique(self):
        """Test updating a location with an existing name."""
        Location.objects.create(name='Wharehouse')
        loc = Location.objects.create(name="Store")
        payload = {'name': 'Wharehouse'}
        url = get_detail_url(loc.id)

        res = self.client.put(url, payload)

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_delete_location(self):
        """Test deleting a location."""
        loc = Location.objects.create(name='Wharehouse')
        url = get_detail_url(loc.id)

        res = self.client.delete(url)

        exists = Location.objects.filter(id=loc.id).exists()
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(exists)
