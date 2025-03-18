from django.contrib import admin
from django.utils.translation import gettext_lazy as _

from books.models import Book, Image, Keyword, Language, Location, Status, Topic

# Register your models here.


class ImageInline(admin.TabularInline):
    model = Image


class KeywordInline(admin.TabularInline):
    model = Keyword


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    # * List display
    list_display = ('ref', 'title', 'author', 'isbn', 'price', 'location', 'status')
    list_filter = ('status', 'location', 'topics', 'languages')
    search_fields = ('ref', 'title', 'author', 'isbn')
    ordering = ['-ref']
    date_hierarchy = 'created_at'
    show_facets = admin.ShowFacets.ALWAYS
    # * Detail and add view
    fieldsets = (
        (_('Public Fields'), {
            'fields': ('ref', 'title', 'author', 'isbn', 'price', 'condition', 'publication_place', 'publisher',
                       'year', 'collection', 'pages', 'description', 'size', 'binding', 'languages', 'topics')
        }),
        (_('Private Fields'), {
            'fields': ('location', 'private_notes', 'status', 'sold_at', 'stock', 'weight', 'slug')
        }),
        (_('Control'), {
            'fields': ('created_at', 'updated_at')
        }),
    )
    filter_horizontal = ('languages', 'topics')
    readonly_fields = ('created_at', 'updated_at')
    prepopulated_fields = {'slug': ('ref', 'title',)}
    inlines = [ImageInline, KeywordInline]


@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name', 'description')


@admin.register(Status)
class StatusAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name', 'description')


@admin.register(Topic)
class TopicAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)


@admin.register(Language)
class LanguageAdmin(admin.ModelAdmin):
    list_display = ('code',)
    search_fields = ('code',)
    ordering = ['code']
