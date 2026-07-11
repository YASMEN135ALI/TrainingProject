from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *
from .auth_views import login_user, register_user

router = DefaultRouter()
router.register('users', UserViewSet)
router.register('permissions', PermissionViewSet)
router.register('settings', GeneralSettingsViewSet)
router.register('categories', DocumentCategoryViewSet)
router.register('documents', DocumentViewSet)
router.register('statuses', DocumentStatusViewSet)
router.register('files', DocumentFilesViewSet)
router.register('activity', ActivityLogViewSet)

urlpatterns = [
    path('auth/login/', login_user),
    path('auth/register/', register_user),
    path('', include(router.urls)),
]
