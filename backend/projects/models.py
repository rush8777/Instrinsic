from django.db import models
from django.conf import settings


class Project(models.Model):
    AI_TOOLS = [
        ('v0', 'v0'),
        ('bolt', 'Bolt'),
        ('replit', 'Replit'),
        ('chatgpt', 'ChatGPT'),
        ('claude', 'Claude'),
    ]
    
    TARGET_USERS = [
        ('students', 'Students'),
        ('developers', 'Developers'),
        ('business', 'Business Users'),
        ('general', 'General Users'),
    ]
    
    EXPERIENCE_LEVELS = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    ]
    
    OUTPUT_TYPES = [
        ('single_component', 'Single Component'),
        ('page', 'Page'),
        ('multi_page_app', 'Multi-Page App'),
        ('api_only', 'API Only'),
        ('full_project', 'Full Project'),
    ]
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('archived', 'Archived'),
        ('deleted', 'Deleted'),
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='projects')
    name = models.CharField(max_length=255)
    description = models.TextField(max_length=300)
    repository_name = models.CharField(max_length=255, blank=True, null=True)
    ai_tools = models.JSONField(default=list)
    # <----------------These should be removed ---------------->
    target_users = models.CharField(max_length=20, choices=TARGET_USERS, blank=True)
    experience_level = models.CharField(max_length=20, choices=EXPERIENCE_LEVELS, blank=True)
    # <------------------------------------------------------------->
    output_type = models.CharField(max_length=20, choices=OUTPUT_TYPES, blank=True)
    expected_outputs = models.JSONField(default=dict)
    frontend_framework = models.CharField(max_length=50, blank=True)
    styling = models.CharField(max_length=50, blank=True)
    backend_framework = models.CharField(max_length=50, blank=True)
    database = models.CharField(max_length=50, blank=True)
    language = models.CharField(max_length=50, blank=True)
    content = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-updated_at']
    
    def __str__(self):
        return f"{self.name} - {self.user.email}"


class PlanMessage(models.Model):
    ROLE_CHOICES = [
        ('user', 'User'),
        ('assistant', 'Assistant'),
    ]
    
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='plan_messages')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['created_at']
    
    def __str__(self):
        return f"{self.project.name} - {self.role} - {self.created_at}"


class StatusItem(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='status_items')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.project.name} - {self.title}"


class Documentation(models.Model):
    project = models.OneToOneField(Project, on_delete=models.CASCADE, related_name='documentation')
    file_tree = models.JSONField(default=dict)
    generated_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.project.name} - Documentation"

