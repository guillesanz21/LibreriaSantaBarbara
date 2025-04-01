"""
Tests for the Books API
"""

from copy import deepcopy
from decimal import Decimal
from django.test import TestCase
from django.urls import reverse
from django.utils.text import slugify
from rest_framework import status
from rest_framework.authentication import get_user_model
from rest_framework.test import APIClient

from books.serializers import BookDetailSerializer
from books.models import Book, Image, Keyword, Language, Location, Status, Topic


BOOK_EXAMPLE = {
    'ref': '1234',
    'title': 'Test Book',
    'author': '',
    'price': Decimal('10.99'),
    'description': 'Test description',
    'status': {
        'name': 'new'
    },
    'location': {
        'name': 'Wharehouse, shelf 1A'
    },
    'images': [
        {
            'url': 'https://example.com/image.jpg'
        },
        {
            'url': 'https://example.com/image2.jpg'
        }
    ],
    'keywords': [
        {
            'name': 'Python'
        },
        {
            'name': 'Django'
        }
    ],
    'topics': [
        {
            'name': 'Fiction'
        },
        {
            'name': 'Science Fiction'
        }
    ],
    'languages': [
        {
            'code': 'en'
        }
    ]
}
BOOKS_URL = reverse('books:books-list')


def detail_url(book_id):
    """Return book detail URL."""
    return reverse('books:books-detail', args=[book_id])


def create_user(email='user@example.com', username="testuser", password='testpass123'):
    """Create and return a sample user."""
    return get_user_model().objects.create_user(
        email=email,
        username=username,
        password=password
    )


def create_book(**params):
    """Create and return a sample book."""
    # We use deepcopy so we don't copy just the reference, but we instead duplicate the object
    defaults = deepcopy(BOOK_EXAMPLE)
    defaults.update(params)

    status = defaults.pop('status')
    location = defaults.pop('location', None)
    images = defaults.pop('images', None)
    keywords = defaults.pop('keywords', None)
    topics = defaults.pop('topics', None)
    languages = defaults.pop('languages', None)

    status = Status.objects.get_or_create(
        name=status['name']
    )
    defaults['status'] = status[0]
    if location:
        location = Location.objects.get_or_create(
            name=location['name']
        )
        defaults['location'] = location[0]

    book = Book.objects.create(**defaults)

    if images is not None:
        Image.objects.bulk_create([
            Image(book=book, **image) for image in images
        ])

    if keywords is not None:
        book.keywords.bulk_create([
            Keyword(book=book, **keyword) for keyword in keywords
        ])

    if topics is not None:
        for topic in topics:
            topic_obj, _ = Topic.objects.get_or_create(**topic)
            book.topics.add(topic_obj)

    if languages is not None:
        for language in languages:
            language_obj, _ = Language.objects.get_or_create(**language)
            book.languages.add(language_obj)

    return book


def create_language(**params):
    """Create and return a sample language."""
    defaults = {'code': 'en'}
    defaults.update(params)

    return Language.objects.create(**defaults)


def create_location(**params):
    """Create and return a sample location."""
    defaults = {'name': 'Wharehouse, shelf 1A'}
    defaults.update(params)

    return Location.objects.create(**defaults)


def create_status(**params):
    """Create and return a sample status."""
    defaults = {'name': 'new'}
    defaults.update(params)

    return Status.objects.create(**defaults)


class PublicBooksApiTest(TestCase):
    """Test unauthenticated access API requests."""

    def setUp(self):
        self.client = APIClient()

    def test_auth_required(self):
        """Test that authentication is required for retrieving books."""
        res = self.client.get(BOOKS_URL)

        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


class PrivateBooksApiTest(TestCase):
    """Test authenticated access API requests."""

    def setUp(self):
        self.client = APIClient()
        self.user = create_user()
        self.client.force_authenticate(self.user)

    # * ######### LIST BOOKS ######### * #
    def test_retrieve_books(self):
        """Test retrieving a list of recipes, without filtering, ordering or custom pagination."""
        create_book(ref='1234')
        create_book(ref='5678')
        create_book(ref='91011')

        res = self.client.get(BOOKS_URL)

        books = Book.objects.all()

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn('next', res.data)
        self.assertIsNone(res.data['next'])
        self.assertEqual(res.data['count'], len(books))
        self.assertEqual(res.data['results'][0]['ref'], 91011)
        # Assert that some fields are not returned in the response:
        self.assertNotIn('location', res.data['results'][0])
        self.assertNotIn('images', res.data['results'][0])
        self.assertNotIn('topics', res.data['results'][0])
        self.assertNotIn('private_notes', res.data['results'][0])

    def test_retrieve_books_with_pagination(self):
        """Test retrieving a list of recipes with custom pagination."""
        create_book(ref='1234')
        create_book(ref='5678')
        create_book(ref='91011')
        create_book(ref='121314')
        create_book(ref='151617')

        res = self.client.get(BOOKS_URL, {'page_size': 2, 'page': 2})

        books = Book.objects.all()
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn('next', res.data)
        self.assertIsNotNone(res.data['next'])
        self.assertEqual(res.data['count'], len(books))
        self.assertEqual(len(res.data['results']), 2)
        self.assertEqual(res.data['results'][0]['ref'], 91011)

    def test_retrieve_books_with_filtering(self):
        """Test retrieving a list of recipes with filtering."""
        create_book(ref='1234', title='Test Book 1', status={'name': 'new'})
        create_book(ref='5678', title='Test book 2', status={'name': 'used'})
        create_book(ref='91011', title='Test Comic 1', status={'name': 'new'})
        used_status_id = Status.objects.get(name='used').id

        res = self.client.get(BOOKS_URL, {'title': 'Test Book', 'status': used_status_id})

        books = Book.objects.filter(title__icontains='Test Book', status__name='used')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['count'], len(books))
        self.assertEqual(res.data['results'][0]['ref'], 5678)

    def test_retrieve_books_with_ordering(self):
        """Test retrieving a list of recipes with ordering."""
        create_book(ref='1234', title='Test Book 2')
        create_book(ref='5678', title='Test Book 1')
        create_book(ref='91011', title='Test Book 3')

        res = self.client.get(BOOKS_URL, {'ordering': 'title'})

        books = Book.objects.all().order_by('title')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['count'], len(books))
        self.assertEqual(res.data['results'][0]['ref'], 5678)

    # * ######### BOOK DETAIL ######### * #
    def test_get_book_detail(self):
        """Test retrieving a book detail."""
        book = create_book(
            ref='1234',
            title='Test Book 1',
            status={'name': 'new'},
            location={'name': 'Wharehouse, shelf 1A'},
            private_notes='Private notes',
        )

        res = self.client.get(detail_url(book.id))
        serializer = BookDetailSerializer(book)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)
        self.assertIn('location', res.data)

    # * ######### CREATE BOOK ######### * #
    def test_create_book(self):
        """Test creating a book."""
        language = create_language(code='en')
        location = create_location(name='store')
        book_status = create_status(name='new')

        payload = deepcopy(BOOK_EXAMPLE)
        payload['location'] = location.id
        payload['status'] = book_status.id
        payload['languages'] = [language.id]
        res = self.client.post(BOOKS_URL, payload, format='json')

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        books = Book.objects.all()
        self.assertEqual(len(books), 1)
        book = books[0]
        self.assertEqual(getattr(book, 'ref'), int(payload['ref']))
        self.assertEqual(getattr(book, 'title'), payload['title'])
        self.assertEqual(
            getattr(book, 'slug'),
            slugify(f'{payload['ref']}-{payload["title"]}')
        )
        self.assertEqual(getattr(book, 'location'), location)
        self.assertEqual(getattr(book, 'status'), book_status)
        self.assertEqual(getattr(book, 'keywords'), book.keywords)
        self.assertEqual(getattr(book, 'images'), book.images)
        self.assertEqual(getattr(book, 'languages'), book.languages)
        # Check that it created the new topics
        self.assertEqual(book.topics.count(), len(payload['topics']))
        for topic in payload['topics']:
            exists = book.topics.filter(name=topic['name']).exists()
            self.assertTrue(exists)

    def test_not_create_book_with_invalid_data(self):
        """Test creating a book with invalid data."""
        payload = deepcopy(BOOK_EXAMPLE)
        # language, location and status are passed with wrong format (as objects instead of ids)

        res = self.client.post(BOOKS_URL, payload, format='json')

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        # Assert that the book was not created
        books = Book.objects.all()
        self.assertEqual(len(books), 0)

    def test_create_book_with_existing_topics(self):
        """Test creating a book with existing topics."""
        book_status = create_status(name='new')
        topic_fiction = Topic.objects.create(name='Fiction')
        payload = deepcopy(BOOK_EXAMPLE)
        payload['topics'] = [
            {'name': 'Fiction'},
            {'name': 'Science Fiction'}
        ]
        payload.pop('location', None)
        payload.pop('languages', None)
        payload['status'] = book_status.id
        res = self.client.post(BOOKS_URL, payload, format='json')

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        books = Book.objects.all()
        self.assertEqual(len(books), 1)
        book = books[0]
        self.assertEqual(book.topics.count(), 2)
        self.assertIn(topic_fiction, book.topics.all())
        for topic in payload['topics']:
            exists = book.topics.filter(name=topic['name']).exists()
            self.assertTrue(exists)

    # * ######### UPDATE BOOK ######### * #
    def test_partial_update_book(self):
        """Test partial update of a book."""
        book = create_book(ref='1234', title='Test Book 1')

        book_status = create_status(name='sold')
        payload = {
            'title': 'Updated Book',
            'status': book_status.id,
        }
        res = self.client.patch(detail_url(book.id), payload, format='json')

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        book.refresh_from_db()
        self.assertEqual(getattr(book, 'ref'), 1234)
        self.assertEqual(getattr(book, 'title'), payload['title'])
        self.assertEqual(getattr(book, 'status'), book_status)

    def test_full_update_book(self):
        """Test full update of a book."""
        book = create_book(ref='1234', title='Test Book 1')

        payload = deepcopy(BOOK_EXAMPLE)
        payload['title'] = 'Updated Book'
        payload['location'] = create_location(name='store').id
        payload['status'] = create_status(name='sold').id
        payload['languages'] = [create_language(code='es').id]

        res = self.client.put(detail_url(book.id), payload, format='json')

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        book.refresh_from_db()
        self.assertEqual(getattr(book, 'title'), payload['title'])

    def test_create_topic_on_update(self):
        """Test creating topic on update."""
        book = create_book(ref='1234', title='Test Book 1')

        payload = {'topics': [{'name': "History"}]}
        res = self.client.patch(detail_url(book.id), payload, format='json')

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        topic = Topic.objects.get(name="History")
        self.assertEqual(topic.name, "History")
        self.assertIn(topic, book.topics.all())

    def test_clear_topics_on_update(self):
        """Test clearing topics on update."""
        book = create_book(ref='1234', title='Test Book 1')
        topic = Topic.objects.create(name="History")
        book.topics.add(topic)

        payload = {'topics': []}
        res = self.client.patch(detail_url(book.id), payload, format='json')

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(book.topics.count(), 0)

    # * ######### DELETE BOOK ######### * #
    def test_delete_book(self):
        """Test deleting a book."""
        book = create_book(ref='1234', title='Test Book 1')

        res = self.client.delete(detail_url(book.id))

        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Book.objects.filter(id=book.id).exists())
