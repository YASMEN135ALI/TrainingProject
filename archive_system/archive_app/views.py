from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

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

from .serializers import (
    UserSerializer,
    PermissionSerializer,
    GeneralSettingsSerializer,
    DocumentCategorySerializer,
    DocumentSerializer,
    DocumentStatusSerializer,
    DocumentFilesSerializer,
    ActivityLogSerializer
)


# ============================
# User ViewSet
# ============================
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]


# ============================
# Permission ViewSet
# ============================
class PermissionViewSet(viewsets.ModelViewSet):
    queryset = Permission.objects.all()
    serializer_class = PermissionSerializer
    permission_classes = [IsAuthenticated]


# ============================
# General Settings ViewSet
# ============================
class GeneralSettingsViewSet(viewsets.ModelViewSet):
    queryset = GeneralSettings.objects.all()
    serializer_class = GeneralSettingsSerializer
    permission_classes = [IsAuthenticated]


# ============================
# Document Category ViewSet
# ============================
class DocumentCategoryViewSet(viewsets.ModelViewSet):
    queryset = DocumentCategory.objects.all()
    serializer_class = DocumentCategorySerializer
    permission_classes = [IsAuthenticated]


# ============================
# Document ViewSet
# ============================
class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Document.objects.select_related(
            "category",
            "owner",
            "created_by"
        )

        reference_number = self.request.query_params.get("reference_number")
        title = self.request.query_params.get("title")
        category = self.request.query_params.get("category")
        status = self.request.query_params.get("status")
        security = self.request.query_params.get("security_level")
        owner = self.request.query_params.get("owner")
        created_at = self.request.query_params.get("created_at")

        if reference_number:
            queryset = queryset.filter(reference_number__icontains=reference_number)

        if title:
           queryset = queryset.filter(title__icontains=title.strip())



        if category:
            queryset = queryset.filter(category__name__icontains=category)

        if status:
            queryset = queryset.filter(status=status)

        if security:
            queryset = queryset.filter(security_level=security)

        if owner:
            queryset = queryset.filter(owner__username__icontains=owner)

        if created_at:
            queryset = queryset.filter(created_at__date=created_at)

        return queryset.order_by("-created_at")

# ============================
# Document Status ViewSet
# ============================
class DocumentStatusViewSet(viewsets.ModelViewSet):
    queryset = DocumentStatus.objects.all()
    serializer_class = DocumentStatusSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = (
            DocumentStatus.objects
            .select_related("document", "updated_by")
        )

        document_id = self.request.query_params.get("document")

        if document_id:
            queryset = queryset.filter(document_id=document_id)

        return queryset

    def perform_create(self, serializer):
        serializer.save(updated_by=self.request.user)

# ============================
# Document Files ViewSet
# ============================
class DocumentFilesViewSet(viewsets.ModelViewSet):
    serializer_class = DocumentFilesSerializer
    permission_classes = [IsAuthenticated]
    queryset = DocumentFiles.objects.all()

    def get_queryset(self):
        queryset = (
            DocumentFiles.objects
            .select_related("document", "uploaded_by")
        )

        document_id = self.request.query_params.get("document")

        if document_id:
            queryset = queryset.filter(document_id=document_id)

        return queryset

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)

# ============================
# Activity Log ViewSet
# ============================
class ActivityLogViewSet(viewsets.ModelViewSet):
    serializer_class = ActivityLogSerializer
    permission_classes = [IsAuthenticated]

    queryset = ActivityLog.objects.select_related(
        "user",
        "document"
    )

    def get_queryset(self):
        queryset = self.queryset

        user = self.request.query_params.get("user")
        action = self.request.query_params.get("action")
        document = self.request.query_params.get("document")

        # فلترة حسب اسم المستخدم
        if user:
            queryset = queryset.filter(user__username__icontains=user)

        # فلترة حسب نوع العملية
        if action:
            queryset = queryset.filter(action__icontains=action)

        # فلترة حسب عنوان الوثيقة
        if document:
            queryset = queryset.filter(document__title__icontains=document)

        return queryset.order_by("-created_at")

