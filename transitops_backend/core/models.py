"""
core/models.py

Shared base model for EVERY entity in the system (Vehicles, Drivers, Trips,
Maintenance, Fuel Logs, Expenses). Gives us:
  - soft deletes (global requirement in the spec)
  - created/updated timestamps (needed for "sorted by update timestamp"
    on the dashboard's recent trips table)

Every model in every app should inherit from BaseModel, NOT models.Model.
"""
from django.db import models
from django.utils import timezone


class SoftDeleteQuerySet(models.QuerySet):
    def delete(self):
        # bulk .delete() calls also get soft-deleted instead of removed
        return super().update(is_deleted=True, deleted_at=timezone.now())

    def hard_delete(self):
        return super().delete()

    def alive(self):
        return self.filter(is_deleted=False)

    def dead(self):
        return self.filter(is_deleted=True)


class SoftDeleteManager(models.Manager):
    """Default manager: only returns non-deleted rows."""

    def get_queryset(self):
        return SoftDeleteQuerySet(self.model, using=self._db).filter(is_deleted=False)


class AllObjectsManager(models.Manager):
    """Escape hatch manager: returns everything, including soft-deleted rows.
    Use Model.all_objects.all() when you explicitly need deleted records
    (e.g. an audit screen)."""

    def get_queryset(self):
        return SoftDeleteQuerySet(self.model, using=self._db)


class BaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(null=True, blank=True)

    objects = SoftDeleteManager()      # default queryset excludes deleted
    all_objects = AllObjectsManager()  # explicit access to everything

    class Meta:
        abstract = True
        ordering = ["-updated_at"]

    def delete(self, using=None, keep_parents=False, hard=False):
        if hard:
            return super().delete(using=using, keep_parents=keep_parents)
        self.is_deleted = True
        self.deleted_at = timezone.now()
        self.save(update_fields=["is_deleted", "deleted_at"])
