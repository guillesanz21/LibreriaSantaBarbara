"""
Tests for the Languages API
"""

from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.authentication import get_user_model
from rest_framework.test import APIClient

from books.serializers import TopicSerializer
from books.models import Topic


TOPICS_URL = reverse('books:topics-list')


def get_detail_url(topic_id):
    """Create and return an topic detail URL."""
    return reverse('books:topics-detail', args=[topic_id])


def create_user(email='user@example.com', username="testuser", password='testpass123'):
    """Create and return a sample user."""
    return get_user_model().objects.create_user(
        email=email,
        username=username,
        password=password
    )


class PublicTopicsApiTest(TestCase):
    """Test unauthenticated access API requests."""

    def setUp(self):
        self.client = APIClient()

    def test_auth_required(self):
        """Test that authentication is required for retrieving languages."""
        res = self.client.get(TOPICS_URL)

        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


class PrivateTopicsApiTest(TestCase):
    """Test authenticated access API requests."""

    def setUp(self):
        self.client = APIClient()
        self.user = create_user()
        self.client.force_authenticate(self.user)

    def test_retrieve_topics(self):
        """Test retrieving topics."""
        Topic.objects.create(name='Fiction')
        Topic.objects.create(name='History')

        res = self.client.get(TOPICS_URL)

        topics = Topic.objects.all()
        serializer = TopicSerializer(topics, many=True)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)

    def test_retrieve_single_topic_not_allowed(self):
        """Test that a single topic cannot be retrieved."""
        topic = Topic.objects.create(name='Fiction')
        url = get_detail_url(topic.id)

        res = self.client.get(url)

        self.assertEqual(res.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_create_topic(self):
        """Test creating a new topic."""
        payload = {'name': 'Fiction'}

        res = self.client.post(TOPICS_URL, payload)

        exists = Topic.objects.filter(
            name=payload['name'].lower()
        ).exists()
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertTrue(exists)

    def test_create_topic_invalid(self):
        """Test creating a new topic with invalid payload."""
        payload = {'name': ''}

        res = self.client.post(TOPICS_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_topic_unique(self):
        """Test creating a new topic with an existing name."""
        Topic.objects.create(name='fiction')
        payload = {'name': 'FICTION'}

        res = self.client.post(TOPICS_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_topic(self):
        """Test updating a topic."""
        topic = Topic.objects.create(name='Fiction')
        payload = {'name': 'History'}
        url = get_detail_url(topic.id)

        res = self.client.patch(url, payload)

        topic.refresh_from_db()
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(topic.name, payload['name'].lower())

    def test_update_topic_invalid(self):
        """Test updating a topic with invalid payload."""
        topic = Topic.objects.create(name='Fiction')
        payload = {'name': ''}
        url = get_detail_url(topic.id)

        res = self.client.patch(url, payload)

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_topic_unique(self):
        """Test updating a topic with an existing name."""
        Topic.objects.create(name='history')
        topic = Topic.objects.create(name='fiction')
        payload = {'name': 'HISTORY'}
        url = get_detail_url(topic.id)

        res = self.client.patch(url, payload)

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_topic_does_not_exist(self):
        """Test updating a topic that does not exist."""
        payload = {'name': 'History'}
        url = get_detail_url(999)

        res = self.client.patch(url, payload)

        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_complete_topic_unique(self):
        """Test updating a topic with an existing name."""
        Topic.objects.create(name='history')
        topic = Topic.objects.create(name='fiction')
        payload = {'name': 'HISTORY'}
        url = get_detail_url(topic.id)

        res = self.client.put(url, payload)

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_delete_topic(self):
        """Test deleting a topic."""
        topic = Topic.objects.create(name='Fiction')
        url = get_detail_url(topic.id)

        res = self.client.delete(url)

        exists = Topic.objects.filter(id=topic.id).exists()
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(exists)
