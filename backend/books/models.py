from django.db import IntegrityError, models
from django.urls import reverse
from django.utils.text import slugify
from django.utils.translation import gettext_lazy as _


class Book(models.Model):
    """
    Book Model
    """
    ref = models.PositiveIntegerField(
        help_text=_("The unique book reference number"),
        error_messages={'unique': 'A book with that reference already exists.'},
        blank=False,
        null=False,
        unique=True,
        verbose_name=_("reference")
    )
    isbn = models.CharField(
        help_text=("The book ISBN"),
        max_length=13,
        blank=True,
        null=True,
        verbose_name=_("ISBN")
    )
    title = models.CharField(
        help_text=_("The book title"),
        max_length=255,
        blank=False,
        null=False,
        verbose_name=_("title")
    )
    slug = models.SlugField(
        help_text=_("The book slug (ref-title)"),
        max_length=255,
        blank=False,
        null=False,
        unique=True,
        verbose_name=_("slug")
    )
    author = models.CharField(
        help_text=_("The book author or authors"),
        max_length=255,
        blank=True,
        # ? null=True,
        verbose_name=_("author")
    )
    publication_place = models.CharField(
        help_text=_("The book publication place (city or country)"),
        max_length=255,
        blank=True,
        null=True,
        verbose_name=_("publication place")
    )
    publisher = models.CharField(
        help_text=_("The book publisher"),
        max_length=255,
        blank=True,
        null=True,
        verbose_name=_("publisher")
    )
    collection = models.CharField(
        help_text=_("The book collection or series (e.g. Austral of Espasa Calpe)"),
        max_length=255,
        blank=True,
        null=True,
        verbose_name=_("collection")
    )
    year = models.PositiveIntegerField(
        help_text=_("The book publication year"),
        blank=True,
        null=True,
        verbose_name=_("publication year")
    )
    size = models.CharField(
        help_text=_("The book size (large x width in cm) (e.g. 8cm x 12cm)"),
        max_length=255,
        blank=True,
        null=True,
        verbose_name=_("size")
    )
    weight = models.PositiveIntegerField(
        help_text=_("The book weight in grams"),
        blank=True,
        null=True,
        verbose_name=_("weight")
    )
    pages = models.PositiveIntegerField(
        help_text=_("The book number of pages"),
        blank=True,
        null=True,
        verbose_name=_("pages")
    )
    condition = models.CharField(
        help_text=_("The physical book condition (e.g. new, used, etc)"),
        max_length=255,
        blank=True,
        null=True,
        verbose_name=_("condition")
    )
    description = models.TextField(
        help_text=_("The book description"),
        blank=True,
        null=True,
        verbose_name=_("description")
    )
    price = models.DecimalField(
        help_text=_("The book price in euros"),
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True,
        # validators=[MinValueValidator(0)],
        verbose_name=_("price")
    )
    stock = models.PositiveIntegerField(
        help_text=_("The book stock"),
        blank=False,
        null=False,
        default=1,
        verbose_name=_("stock")
    )
    binding = models.CharField(
        help_text=_("The book binding (e.g. paperback, hardcover, etc)"),
        max_length=255,
        blank=True,
        null=True,
        verbose_name=_("binding")
    )
    private_notes = models.TextField(
        help_text=_("Private notes about the book"),
        blank=True,
        null=True,
        verbose_name=_("private notes")
    )
    created_at = models.DateTimeField(
        help_text=_("The date and time the book was created"),
        auto_now_add=True,
        verbose_name=_("created at")
    )
    updated_at = models.DateTimeField(
        help_text=_("The date and time the book was last updated"),
        auto_now=True,
        verbose_name=_("updated at")
    )
    sold_at = models.DateTimeField(
        help_text=_("The date and time the book was sold"),
        blank=True,
        null=True,
        verbose_name=_("sold at")
    )

    # * Relationships
    status = models.ForeignKey(
        "books.Status",  # Status model is defined below
        on_delete=models.RESTRICT,
        related_name="books",
        help_text=_("The book status"),
        blank=False,
        null=False,
        verbose_name=_("status")
    )

    location = models.ForeignKey(
        "books.Location",  # Location model is defined below
        on_delete=models.RESTRICT,
        related_name="books",
        help_text=_("The book location (e.g. Store, Warehouse, etc)"),
        blank=True,
        null=True,
        verbose_name=_("location")
    )
    # images (1..n)
    # keywords (1..n)
    topics = models.ManyToManyField(
        "books.Topic",  # Topic model is defined below
        related_name="books",
        help_text=_("The book topics (e.g. Science Fiction, Fantasy, etc)"),
        blank=True,
        verbose_name=_("topics")
    )
    languages = models.ManyToManyField(
        "books.Language",  # Language model is defined below
        related_name="books",
        help_text=_("The book languages"),
        blank=True,
        verbose_name=_("languages")
    )

    class Meta:
        indexes = [
            models.Index(fields=['-ref']),
            # TODO: I need an index in both orderings for the following fields, check the best way to do it
            models.Index(fields=['-created_at']),
            models.Index(fields=['-updated_at']),
            models.Index(fields=['-sold_at']),
            models.Index(fields=['price']),
        ]
        ordering = ['-created_at']
        verbose_name = _("book")
        verbose_name_plural = _("books")

    def __str__(self):
        """
        String representation of the book
        """
        return f"[{self.ref}] {self.title} - {self.author if self.author else _('Author unknown')}"

    def get_absolute_url(self):
        return reverse("books:book_detail", args=[self.slug])

    def save(self, *args, **kwargs):
        """
        Custom save method to update the slug field
        """
        # If price is negative, raise an error
        if self.price and self.price < 0:
            raise IntegrityError("The price cannot be negative")
        if not self.slug:
            self.slug = slugify(f"{self.ref}-{self.title}")
        super().save(*args, **kwargs)


class Status(models.Model):
    """
    Status (of a Book) Model.
    [Book M - 1 Status]. A status can have multiple books.
    """
    name = models.CharField(
        help_text=_("The status name (e.g. Sold, Available, etc)"),
        max_length=255,
        blank=False,
        null=False,
        unique=True,
        verbose_name=_("name")
    )
    description = models.TextField(
        help_text=_("The status description"),
        blank=True,
        null=True,
        verbose_name=_("description")
    )

    class Meta:
        verbose_name = _("status")
        verbose_name_plural = _("statuses")

    def __str__(self):
        """
        String representation of the status
        """
        return self.name


class Location(models.Model):
    """
    Location Model.
    [Book M - 1 Location]. A location can have multiple books.
    """
    name = models.CharField(
        help_text=_("The location name (e.g. Store, Warehouse (shelf 13), etc)"),
        max_length=255,
        blank=False,
        null=False,
        unique=True,
        verbose_name=_("name")
    )
    description = models.TextField(
        help_text=_("The location description (e.g. Warehouse shelf 13 at the back of the store)"),
        blank=True,
        null=True,
        verbose_name=_("description")
    )

    class Meta:
        verbose_name = _("location")
        verbose_name_plural = _("locations")

    def __str__(self):
        """
        String representation of the location
        """
        return self.name


class Image(models.Model):
    """
    Image URL Model.
    [Book 1 - N Image]. A book can have multiple images.
    """
    book = models.ForeignKey(
        Book,  # Book model is defined above
        on_delete=models.CASCADE,
        related_name="images",
        help_text=_("The book the image belongs to"),
        blank=False,
        null=False,
        verbose_name=_("book")
    )
    url = models.URLField(
        help_text=_("The image URL"),
        max_length=2000,
        blank=False,
        null=False,
        verbose_name=_("URL")
    )

    class Meta:
        verbose_name = _("image")
        verbose_name_plural = _("images")

    def __str__(self):
        """
        String representation of the image
        """
        return self.url


# NICETOHAVE: This is very costly, there is a huge number of keywords. Two options:
# - Use a CharField inside the Book model and separate the keywords with commas
# - Use Redis or another cache system to store the keywords
class Keyword(models.Model):
    """
    Keyword Model.
    [Book 1 - N Keyword]. A book can have multiple keywords.
    """
    book = models.ForeignKey(
        Book,  # Book model is defined above
        on_delete=models.CASCADE,
        related_name="keywords",
        help_text=_("The book the keyword belongs to"),
        blank=False,
        null=False,
        verbose_name=_("book")
    )
    name = models.SlugField(
        help_text=_("The keyword name"),
        max_length=75,
        blank=False,
        null=False,
        unique=True,
        verbose_name=_("name")
    )


class Topic(models.Model):
    """
    Topic Model.
    [Book M - N Topic]. A book can have multiple topics, and a topic can have multiple books.
    """
    name = models.CharField(
        help_text=_("The topic name (e.g. Science Fiction, Fantasy, etc)"),
        max_length=255,
        blank=False,
        null=False,
        unique=True,
        verbose_name=_("name")
    )

    class Meta:
        verbose_name = _("topic")
        verbose_name_plural = _("topics")

    def __str__(self):
        """
        String representation of the topic
        """
        return self.name


class Language(models.Model):
    """
    Language Model.
    [Book M - N Language]. A book can have multiple languages, and a language can have multiple books.
    """
    code = models.CharField(
        help_text=_("The language code (ISO 639-1 Alpha-2) (e.g. en, es, fr, etc)"),
        max_length=2,
        blank=False,
        null=False,
        unique=True,
        verbose_name=_("code")
    )
    # TODO: Add a language name field. The problem is that the name is different in each language

    class Meta:
        verbose_name = _("language")
        verbose_name_plural = _("languages")

    def __str__(self):
        """
        String representation of the language
        """
        return self.code
