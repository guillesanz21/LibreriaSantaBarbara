from django.contrib import admin
from django.utils.translation import gettext_lazy as _

from books.models import Book

# Register your models here.


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    # TODO: Add property "sold" if the "sold_at" field is not null
    # * List display
    list_display = ('ref', 'title', 'author', 'isbn', 'price', 'location')
    list_filter = ('status', 'location', 'topics', 'languages')
    search_fields = ('ref', 'title', 'author', 'isbn')
    ordering = ['ref']
    date_hierarchy = 'created_at'
    # * Detail and add view
    # Secciones:
    # Public fields (title, author, isbn, price, publication_place, publisher, year,
    #               collection, pages, description, size, condition, binding,
    #               images, languages, topics, keywords)
    # Private Fields (ref, location, private_notes, status, stock, weight, slug, sold_at)
    # Control (created_at, updated_at)
    fieldsets = (
        (_('Public Fields'), {
            'fields': ('title', 'author', 'isbn', 'price', 'publication_place', 'publisher', 'year',
                       'collection', 'pages', 'description', 'size', 'condition', 'binding',)
            #    'images', 'languages', 'topics', 'keywords')
        }),
        (_('Private Fields'), {
            'fields': ('ref', 'location', 'private_notes', 'status', 'stock', 'weight', 'slug', 'sold_at')
        }),
        (_('Control'), {
            'fields': ('created_at', 'updated_at')
        }),
    )
    readonly_fields = ('created_at', 'updated_at')
    prepopulated_fields = {'slug': ('ref', 'title',)}

    # prepopulated_fields = {'slug' } # ref-title
# created_at, updated_at are readonly
# Dentro de book, inline: image, keyword, status, location
