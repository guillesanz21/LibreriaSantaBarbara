"""
Tests for the Statuses API
"""

from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.authentication import get_user_model
from rest_framework.test import APIClient

from books.serializers import StatusListSerializer, StatusSerializer
from books.models import Status


STATUS_URL = reverse('books:status-list')


def get_detail_url(status_id):
    """Create and return an status detail URL."""
    return reverse('books:status-detail', args=[status_id])


def create_user(email='user@example.com', username="testuser", password='testpass123'):
    """Create and return a sample user."""
    return get_user_model().objects.create_user(
        email=email,
        username=username,
        password=password
    )


class PublicStatusApiTest(TestCase):
    """Test unauthenticated access API requests."""

    def setUp(self):
        self.client = APIClient()

    def test_auth_required(self):
        """Test that authentication is required for retrieving statuses."""
        res = self.client.get(STATUS_URL)

        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


class PrivateStatusApiTest(TestCase):
    """Test authenticated access API requests."""

    def setUp(self):
        self.client = APIClient()
        self.user = create_user()
        self.client.force_authenticate(self.user)

    def test_retrieve_statuses(self):
        """Test retrieving statuses."""
        Status.objects.create(name='New')
        Status.objects.create(name='Sold')

        res = self.client.get(STATUS_URL)

        sts = Status.objects.all()
        serializer = StatusListSerializer(sts, many=True)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)

    def test_retrieve_single_status(self):
        """Test retrieving a single status."""
        st = Status.objects.create(name='New')
        url = get_detail_url(st.id)

        res = self.client.get(url)

        serializer = StatusSerializer(st)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)

    def test_retrieve_single_status_not_found(self):
        """Test retrieving a single status that does not exist."""
        url = get_detail_url(999)

        res = self.client.get(url)

        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)

    def test_create_status(self):
        """Test creating a new status."""
        payload = {'name': 'New'}

        res = self.client.post(STATUS_URL, payload)

        exists = Status.objects.filter(
            name=payload['name']
        ).exists()
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertTrue(exists)

    def test_create_status_invalid(self):
        """Test creating a new status with invalid payload."""
        payload = {'name': ''}

        res = self.client.post(STATUS_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_status_unique(self):
        """Test creating a new status with an existing name."""
        Status.objects.create(name='new')
        payload = {'name': 'new'}

        res = self.client.post(STATUS_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_status(self):
        """Test updating a status."""
        st = Status.objects.create(name='New')
        payload = {'name': 'Sold'}
        url = get_detail_url(st.id)

        res = self.client.patch(url, payload)

        st.refresh_from_db()
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(st.name, payload['name'])

    def test_update_status_invalid(self):
        """Test updating a status with invalid payload."""
        st = Status.objects.create(name='New')
        payload = {'name': ''}
        url = get_detail_url(st.id)

        res = self.client.patch(url, payload)

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_status_unique(self):
        """Test updating a status with an existing name."""
        Status.objects.create(name='new')
        st = Status.objects.create(name='sold')
        payload = {'name': 'new'}
        url = get_detail_url(st.id)

        res = self.client.patch(url, payload)

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_complete_status_unique(self):
        """Test updating a status with an existing name."""
        Status.objects.create(name='new')
        st = Status.objects.create(name='sold')
        payload = {'name': 'new'}
        url = get_detail_url(st.id)

        res = self.client.put(url, payload)

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_delete_status(self):
        """Test deleting a status."""
        st = Status.objects.create(name='New')
        url = get_detail_url(st.id)

        res = self.client.delete(url)

        exists = Status.objects.filter(id=st.id).exists()
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(exists)
