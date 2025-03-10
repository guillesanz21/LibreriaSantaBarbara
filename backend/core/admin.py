from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


admin.site.register(User, UserAdmin)
UserAdmin.list_display = ('email', 'username', 'is_active', 'is_email_verified', 'is_staff',)
UserAdmin.list_filter += ('is_email_verified',)  # type: ignore
# Add fieldsets are used to organize the fields in the add page
UserAdmin.add_fieldsets = (
    (None, {  # None is the title of the section (not displayed)
        'fields': ('email', 'is_email_verified',),
    }),
) + UserAdmin.add_fieldsets
# Fieldsets are used to organize the fields in the edit page
UserAdmin.fieldsets[3][1]['fields'] += ('deleted_at',)   # type: ignore
UserAdmin.fieldsets += (  # type: ignore
    ('Verification', {'fields': ('is_email_verified', 'email_hash',)}),
)
UserAdmin.readonly_fields = ('id', 'date_joined', 'last_login', 'email_hash',)
