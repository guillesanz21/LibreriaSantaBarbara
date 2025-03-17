from django.db import models
from django.utils.translation import gettext_lazy as _


class Book(models.Model):
    """
    Book Model
    """
    ref = models.CharField(
        help_text=_("The unique book reference"),
        error_messages={'unique': 'A book with that reference already exists.'},
        max_length=255,
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
        blank=True,
        null=True,
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
    year = models.IntegerField(
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
    weight = models.IntegerField(
        help_text=_("The book weight in grams"),
        blank=True,
        null=True,
        verbose_name=_("weight")
    )
    pages = models.IntegerField(
        help_text=_("The book number of pages"),
        blank=True,
        null=True,
        verbose_name=_("pages")
    )
    condition = models.CharField(
        help_text=_("The physical book condition"),
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
        verbose_name=_("price")
    )
    stock = models.IntegerField(
        help_text=_("The book stock"),
        blank=True,
        null=True,
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

    # status
    # location
    # topic
    # language
    # image

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
