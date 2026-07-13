from django.contrib import admin
from .models import (
    User,
    Permission,ActivityLog,
    GeneralSettings,
    Document,
    DocumentStatus,
    DocumentFiles
)

# Register your models here.
admin.site.register(User)

admin.site.register(GeneralSettings)
admin.site.register(Document)
admin.site.register(DocumentStatus)
admin.site.register(DocumentFiles)
admin.site.register(ActivityLog)
admin.site.register( Permission)