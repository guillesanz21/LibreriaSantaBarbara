"""
Test cases for the models.
"""


from decimal import Decimal
from django.test import TestCase

from books import models


class ModelTests(TestCase):
    """
    Test Book related models:
    - Book
    - Status
    - Location
    - Image
    - Keyword
    - Topic
    - Language
    """

    def test_create_status(self):
        """
        Test creating a new status.
        """
        status = models.Status.objects.create(
            name="New",
        )

        self.assertEqual(status.name, "New")

    def test_create_location(self):
        """
        Test creating a new location.
        """
        location_name = "Wharehouse, shelf 1A"
        location = models.Location.objects.create(name=location_name)

        self.assertEqual(location.name, location_name)

    def test_create_topic(self):
        """
        Test creating a new topic.
        """
        topic = models.Topic.objects.create(name="Fiction")

        self.assertEqual(topic.name, "Fiction")

    def test_create_language(self):
        """
        Test creating a new language.
        """
        language = models.Language.objects.create(code="en")

        self.assertEqual(language.code, "en")

    def test_create_book(self):
        """
        Test creating a new book, with the following relationships:
        - Status
        - Location
        - Image
        - Keyword
        - Topic
        - Language
        """
        image_url_1 = "https://example.com/image.jpg"
        image_url_2 = "https://example.com/image2.jpg"
        keyword1_name = "Python"
        keyword2_name = "Django"
        topic_name = "Fiction"
        language_code = "en"

        status = models.Status.objects.create(name="New")
        location = models.Location.objects.create(name="Wharehouse, shelf 1A")

        book = models.Book.objects.create(
            ref="1234",
            title="Test Book",
            author="",
            price=Decimal('10.0'),
            status=status,
            location=location,
        )
        # Option 1: Create the image and add the book to it
        # image = models.Image.objects.create(book=book, url=image_url_1)
        # Option 2: Use the related_name to add the image to the book
        # book.images.create(url=image_url_1)
        # Option 3: bulk_create (1 query) NOTE: In Serializer, use it with transactions
        # https://stackoverflow.com/questions/31820017/create-multiple-objects-without-multiple-hits-to-the-db-in-django-1-8 # noqa
        models.Image.objects.bulk_create([
            models.Image(book=book, url=image_url_1),
            models.Image(book=book, url=image_url_2)
        ])

        models.Keyword.objects.bulk_create([
            models.Keyword(book=book, name=keyword1_name),
            models.Keyword(book=book, name=keyword2_name)
        ])

        topic = models.Topic.objects.create(name=topic_name)
        book.topics.add(topic)

        language = models.Language.objects.create(code=language_code)
        book.languages.add(language)

        self.assertEqual(str(book), "[1234] Test Book - Author unknown")
        self.assertEqual(book.ref, "1234")
        self.assertEqual(book.title, "Test Book")
        self.assertEqual(book.slug, "1234-test-book")
        self.assertEqual(book.author, "")
        self.assertEqual(book.price, Decimal('10.0'))
        self.assertEqual(book.status, status)
        self.assertEqual(book.location, location)
        self.assertEqual(book.images.count(), 2)
        self.assertEqual(book.images.first().url, image_url_1)
        self.assertEqual(book.keywords.count(), 2)
        self.assertEqual(book.keywords.first().name, keyword1_name)
        self.assertEqual(book.topics.count(), 1)
        self.assertEqual(book.topics.first().name, topic_name)
        self.assertEqual(book.languages.count(), 1)
        self.assertEqual(book.languages.first().code, language_code)
