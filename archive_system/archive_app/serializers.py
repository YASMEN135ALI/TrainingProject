from rest_framework import serializers
from .models import (
    User,
    Permission,
    GeneralSettings,
    DocumentCategory,
    Document,
    DocumentStatus,
    DocumentFiles,
    ActivityLog
)


# ============================
# User Serializer
# ============================
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'role',
            'is_active',
            'created_at'
        ]
        extra_kwargs = {
            'password': {'write_only': True}
        }


# ============================
# Permission Serializer
# ============================
class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = '__all__'


# ============================
# General Settings Serializer
# ============================
class GeneralSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = GeneralSettings
        fields = '__all__'


# ============================
# Document Category Serializer
# ============================
class DocumentCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentCategory
        fields = '__all__'


# ============================
# Document Serializer
# ============================
class DocumentSerializer(serializers.ModelSerializer):
    
    category_name = serializers.CharField(
        source="category.name",
        read_only=True
    )

    owner_name = serializers.CharField(
        source="owner.username",
        read_only=True
    )

    created_by_name = serializers.CharField(
        source="created_by.username",
        read_only=True
    )

    class Meta:
        model = Document
        fields = [
            'id',
            'reference_number',
            'title',
            'description',

            'category',
            'category_name',

            'security_level',
            'status',

            'owner',
            'owner_name',

            'created_by',
            'created_by_name',

            'archive_date',
            'attachment',

            'created_at',
            'updated_at'
        ]

# ============================
# Document Status Serializer
# ============================
class DocumentStatusSerializer(serializers.ModelSerializer):
    
    # اسم الشخص الذي قام بالتحديث
    updated_by_name = serializers.CharField(
        source="updated_by.username",
        read_only=True
    )

    class Meta:
        model = DocumentStatus
        fields = [
            "id",
            "document",
            "status",
            "notes",
            "updated_by",
            "updated_by_name",
            "updated_at",
        ]
        read_only_fields = ["updated_by", "updated_at"]


# ============================
# Document Files Serializer
# ============================
class DocumentFilesSerializer(serializers.ModelSerializer):
    
    # اسم المستخدم الذي رفع الملف
    uploaded_by = serializers.StringRelatedField(read_only=True)

    # اسم الوثيقة
    document_name = serializers.CharField(
        source="document.title",
        read_only=True
    )

    # اسم الرافع (username)
    uploaded_by_name = serializers.CharField(
        source="uploaded_by.username",
        read_only=True
    )

    class Meta:
        model = DocumentFiles
        fields = [
            "id",
            "document",
            "document_name",
            "file_path",
            "uploaded_by",
            "uploaded_by_name",
            "uploaded_at",
        ]

# ============================
# Activity Log Serializer
# ============================
class ActivityLogSerializer(serializers.ModelSerializer):

    # اسم المستخدم الذي قام بالعملية
    user = serializers.CharField(
        source="user.username",
        read_only=True
    )

    # عنوان الوثيقة المرتبطة بالنشاط
    document = serializers.CharField(
        source="document.title",
        read_only=True
    )

    class Meta:
        model = ActivityLog
        fields = [
            "id",
            "user",
            "action",
            "document",
            "created_at",
        ]

