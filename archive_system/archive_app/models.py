from django.db import models
from django.contrib.auth.models import AbstractUser


# ============================
# User Model (احترافي)
# ============================
class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'مدير نظام'),
        ('manager', 'مسؤول قسم'),
        ('employee', 'موظف'),
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='employee')
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.username



# ============================
# Permission Model
# ============================
class Permission(models.Model):
    role = models.CharField(max_length=50)
    can_add = models.BooleanField(default=False)
    can_edit = models.BooleanField(default=False)
    can_delete = models.BooleanField(default=False)
    can_archive = models.BooleanField(default=False)
    can_restore = models.BooleanField(default=False)

    def __str__(self):
        return f"صلاحيات الدور: {self.role}"



# ============================
# General Settings
# ============================
class GeneralSettings(models.Model):
    document_types = models.JSONField(default=dict)
    security_levels = models.JSONField(default=dict)
    archive_rules = models.JSONField(default=dict)

    def __str__(self):
        return f"إعدادات النظام"



# ============================
# Security Level Enum
# ============================
class SecurityLevel(models.TextChoices):
    PUBLIC = 'PUBLIC', 'عام'
    INTERNAL = 'INTERNAL', 'داخلي'
    CONFIDENTIAL = 'CONFIDENTIAL', 'سري'
    TOP_SECRET = 'TOP_SECRET', 'سري للغاية'


# ============================
# Document Status Enum
# ============================
class Status(models.TextChoices):
    ACTIVE = 'ACTIVE', 'نشط'
    ARCHIVED = 'ARCHIVED', 'مؤرشف'
    DELETED = 'DELETED', 'محذوف'



# ============================
# Document Category
# ============================
class DocumentCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name



# ============================
# Document Model (النسخة النهائية)
# ============================
class Document(models.Model):
    reference_number = models.CharField(
        max_length=100,
        unique=True
    )

    title = models.CharField(max_length=200)

    description = models.TextField(
        blank=True,
        null=True
    )

    category = models.ForeignKey(
        DocumentCategory,
        on_delete=models.SET_NULL,
        null=True
    )

    security_level = models.CharField(
        max_length=20,
        choices=SecurityLevel.choices,
        default=SecurityLevel.INTERNAL
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.ACTIVE
    )

    owner = models.ForeignKey(
        User,
        related_name='owned_documents',
        on_delete=models.SET_NULL,
        null=True
    )

    created_by = models.ForeignKey(
        User,
        related_name='created_documents',
        on_delete=models.SET_NULL,
        null=True
    )

    archive_date = models.DateField(
        null=True,
        blank=True
    )

    attachment = models.FileField(
        upload_to='attachments/',
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.reference_number} - {self.title}"



# ============================
# Document Status History
# ============================
class DocumentStatus(models.Model):
    document = models.ForeignKey(
        Document,
        on_delete=models.CASCADE,
        related_name='statuses'
    )

    status = models.CharField(max_length=100)
    notes = models.TextField(null=True, blank=True)

    updated_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True
    )

    updated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.document.title} - {self.status}"



# ============================
# Document Files
# ============================
class DocumentFiles(models.Model):
    document = models.ForeignKey(
        Document,
        on_delete=models.CASCADE,
        related_name='files'
    )

    file_path = models.FileField(upload_to='document_files/')
    uploaded_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True
    )

    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"ملف للوثيقة: {self.document.title}"



# ============================
# Activity Log
# ============================
class ActivityLog(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True
    )

    action = models.CharField(max_length=255)

    document = models.ForeignKey(
        Document,
        on_delete=models.SET_NULL,
        null=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.action
