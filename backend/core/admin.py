from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


admin.site.register(User, UserAdmin)
UserAdmin.list_display = ('email', 'username', 'is_active', 'is_email_verified', 'is_staff',)
UserAdmin.list_filter += ('is_email_verified',)  # type: ignore
UserAdmin.add_fieldsets = (   # Add fieldsets are used to organize the fields in the add page
    (None, {  # None is the title of the section (not displayed)
        'fields': ('email', 'is_email_verified',),
    }),
) + UserAdmin.add_fieldsets


# @admin.register(User)
# class UserAdmin(admin.ModelAdmin):
#     list_display = ['email', 'username', 'is_email_verified', 'is_active', 'is_staff']
#     search_fields = ['email', 'username']
#     list_filter = ['is_active', 'is_email_verified', 'is_staff', 'is_superuser']
#     ordering = ['id']
#     readonly_fields = ['id', 'date_joined', 'last_login', 'email_hash', 'deleted_at']
#     fieldsets = (
#         (None, {'fields': ('id', 'email', 'username', 'password')}),
#         ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser')}),
#         ('Important dates', {'fields': ('last_login', 'date_joined')}),
#     )
#     add_fieldsets = (
#         (None, {
#             'classes': ('wide',),
#             'fields': ('email', 'username', 'password1', 'password2'),
#         }),
#     )
