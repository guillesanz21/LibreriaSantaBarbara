from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Customer


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def upgrade_customer_signal(sender, instance, created, **kwargs):
    """
    Signal to create a Customer object when a User object is created.
    Besides, it upgrades the Customer object when the User object is updated.
    """
    if created:
        Customer.objects.create(user=instance)
    instance.customer.save()
