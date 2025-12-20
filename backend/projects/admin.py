from django.contrib import admin
from .models import Project


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'status', 'output_type', 'created_at', 'updated_at')
    list_filter = ('status', 'output_type', 'created_at')
    search_fields = ('name', 'description', 'user__email')
    readonly_fields = ('created_at', 'updated_at')

