"""
Serializers for the books API.
"""

from rest_framework import serializers
from books.models import Book, Image, Keyword, Language, Location, Status, Topic


# * Language Serializers
class LanguageSerializer(serializers.ModelSerializer):
    """
    Serializer for the Language model.
    """
    class Meta:
        model = Language
        fields = '__all__'
        read_only_fields = ['id']

    def create(self, validated_data):
        validated_data['code'] = validated_data['code'].lower()
        return super().create(validated_data)

    def update(self, instance, validated_data):
        validated_data['code'] = validated_data['code'].lower()
        return super().update(instance, validated_data)


# * Topic Serializers
class TopicSerializer(serializers.ModelSerializer):
    """
    Serializer for the Topic View.
    """
    class Meta:
        model = Topic
        fields = '__all__'
        read_only_fields = ['id']
        extra_kwargs = {
            'name': {'validators': []}
        }

    # TODO: Remove tildes
    def create(self, validated_data):
        validated_data['name'] = validated_data['name'].lower()
        return super().create(validated_data)

    def update(self, instance, validated_data):
        validated_data['name'] = validated_data['name'].lower()
        return super().update(instance, validated_data)


# * Status Serializers
class StatusSerializer(serializers.ModelSerializer):
    """
    Serializer for the Status View.
    """
    class Meta:
        model = Status
        fields = '__all__'
        read_only_fields = ['id']


class StatusListSerializer(StatusSerializer):
    """
    Serializer for the Status List View.
    """
    class Meta(StatusSerializer.Meta):
        fields = ['id', 'name']


# * Location Serializers
class LocationSerializer(serializers.ModelSerializer):
    """
    Serializer for the Location View.
    """
    class Meta:
        model = Location
        fields = '__all__'
        read_only_fields = ['id']


class LocationListSerializer(LocationSerializer):
    """
    Serializer for the Location List View.
    """
    class Meta(LocationSerializer.Meta):
        fields = ['id', 'name']


# * Image Serializers
class ImageSerializer(serializers.ModelSerializer):
    """
    Serializer for the Image View.
    """
    class Meta:
        model = Image
        exclude = ['book']
        read_only_fields = ['id']
        extra_kwargs = {
            'book': {'required': False}
        }


# * Keyword Serializers
class KeywordSerializer(serializers.ModelSerializer):
    """
    Serializer for the Keyword View.
    """
    class Meta:
        model = Keyword
        exclude = ['book']
        read_only_fields = ['id']
        extra_kwargs = {
            'book': {'required': False}
        }


# * Book Serializers
class BookSerializer(serializers.ModelSerializer):
    """
    Serializer for the Book View.
    """
    images = ImageSerializer(many=True, required=False)
    keywords = KeywordSerializer(many=True, required=False)
    topics = TopicSerializer(many=True, required=False)
    # Languages, location and status are specified by the id.
    # We don't want to create a language, location or status on the fly. They must exist.

    class Meta:
        model = Book
        fields = '__all__'  # TODO: Remove some fields
        read_only_fields = ['id', 'created_at', 'updated_at', 'sold_at']
        extra_kwargs = {
            'slug': {'required': False},
        }

    def _get_or_create_images(self, images, book):
        """Get or create images for a book."""
        for image in images:
            image_obj, _ = Image.objects.get_or_create(book=book, **image)
            book.images.add(image_obj)

    def _get_or_create_keywords(self, keywords, book):
        """Get or create keywords for a book."""
        for keyword in keywords:
            keyword_obj, _ = Keyword.objects.get_or_create(book=book, **keyword)
            book.keywords.add(keyword_obj)

    def _get_or_create_topics(self, topics, book):
        """Get or create topics for a book."""
        for topic in topics:
            topic_obj, _ = Topic.objects.get_or_create(**topic)
            book.topics.add(topic_obj)

    def create(self, validated_data):
        """Create a new Book."""
        images = validated_data.pop('images', [])
        keywords = validated_data.pop('keywords', [])
        topics = validated_data.pop('topics', [])

        book = super().create(validated_data)
        self._get_or_create_images(images, book)
        self._get_or_create_keywords(keywords, book)
        self._get_or_create_topics(topics, book)

        return book

    def update(self, instance, validated_data):
        """Update a Book."""
        images = validated_data.pop('images', None)
        keywords = validated_data.pop('keywords', None)
        topics = validated_data.pop('topics', None)

        # If the user edits the images or keywords through the base book serializer, then
        # we suppose that he wants to replace the current images or keywords with the new ones.
        if images is not None:
            instance.images.all().delete()
            self._get_or_create_images(images, instance)

        if keywords is not None:
            instance.keywords.all().delete()
            self._get_or_create_keywords(keywords, instance)

        if topics is not None:
            # Instead of deleting all the topics, since this is a many-to-many relationship,
            # we just clear the current topics and add the new ones.
            instance.topics.clear()
            self._get_or_create_topics(topics, instance)

        return super().update(instance, validated_data)


class BookDetailSerializer(BookSerializer):
    """
    Serializer for the Book Detail View.
    """
    status = StatusSerializer(required=True)
    location = LocationSerializer(required=False)
    languages = LanguageSerializer(many=True, required=False)


class BookListSerializer(serializers.ModelSerializer):
    """
    Serializer for the Book Detail View.
    """
    status = StatusSerializer()

    class Meta:
        model = Book
        fields = ['id', 'ref', 'title', 'author', 'condition', 'status', 'stock', 'price']
