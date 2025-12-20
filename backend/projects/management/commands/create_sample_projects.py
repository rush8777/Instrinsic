"""
Django management command to create sample projects for testing/demo purposes.
Usage: python manage.py create_sample_projects [--user-email EMAIL] [--count COUNT]
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from projects.models import Project

User = get_user_model()


class Command(BaseCommand):
    help = 'Creates sample projects for the website. Can specify user email and count.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--user-email',
            type=str,
            help='Email of the user to create projects for. If not provided, uses the first superuser or creates a demo user.',
        )
        parser.add_argument(
            '--count',
            type=int,
            default=5,
            help='Number of sample projects to create (default: 5)',
        )
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear all existing sample projects before creating new ones',
        )

    def handle(self, *args, **options):
        user_email = options.get('user_email')
        count = options.get('count', 5)
        clear = options.get('clear', False)

        # Get or create user
        if user_email:
            try:
                user = User.objects.get(email=user_email)
                self.stdout.write(self.style.SUCCESS(f'Using existing user: {user.email}'))
            except User.DoesNotExist:
                self.stdout.write(self.style.ERROR(f'User with email {user_email} not found.'))
                return
        else:
            # Try to get first superuser, or create a demo user
            user = User.objects.filter(is_superuser=True).first()
            if not user:
                user = User.objects.first()
            if not user:
                # Create a demo user
                user = User.objects.create_user(
                    email='demo@example.com',
                    username='demo',
                    password='demo123456'
                )
                self.stdout.write(self.style.SUCCESS(f'Created demo user: {user.email}'))
            else:
                self.stdout.write(self.style.SUCCESS(f'Using existing user: {user.email}'))

        # Clear existing sample projects if requested
        if clear:
            deleted_count = Project.objects.filter(user=user, name__startswith='Sample Project').delete()[0]
            if deleted_count > 0:
                self.stdout.write(self.style.WARNING(f'Deleted {deleted_count} existing sample projects'))

        # Sample project data
        sample_projects = [
            {
                'name': 'Sample Project: E-commerce Landing Page',
                'description': 'A modern e-commerce landing page with product showcase, shopping cart, and checkout flow.',
                'ai_tools': ['v0', 'chatgpt'],
                'target_users': 'business',
                'experience_level': 'intermediate',
                'output_type': 'page',
                'expected_outputs': {'code': True, 'explanation': True},
                'frontend_framework': 'React',
                'styling': 'Tailwind CSS',
                'backend_framework': 'Node.js',
                'database': 'PostgreSQL',
                'language': 'TypeScript',
            },
            {
                'name': 'Sample Project: Todo App Component',
                'description': 'A reusable todo list component with add, edit, delete, and filter functionality.',
                'ai_tools': ['bolt', 'claude'],
                'target_users': 'developers',
                'experience_level': 'beginner',
                'output_type': 'single_component',
                'expected_outputs': {'code': True},
                'frontend_framework': 'React',
                'styling': 'CSS Modules',
                'language': 'JavaScript',
            },
            {
                'name': 'Sample Project: Blog Platform',
                'description': 'A full-featured blog platform with user authentication, post creation, and comments.',
                'ai_tools': ['v0', 'replit', 'chatgpt'],
                'target_users': 'developers',
                'experience_level': 'advanced',
                'output_type': 'multi_page_app',
                'expected_outputs': {'code': True, 'explanation': True, 'tests': True},
                'frontend_framework': 'Next.js',
                'styling': 'Tailwind CSS',
                'backend_framework': 'Python',
                'database': 'PostgreSQL',
                'language': 'TypeScript',
            },
            {
                'name': 'Sample Project: Weather API',
                'description': 'A RESTful API for weather data with endpoints for current conditions and forecasts.',
                'ai_tools': ['chatgpt', 'claude'],
                'target_users': 'developers',
                'experience_level': 'intermediate',
                'output_type': 'api_only',
                'expected_outputs': {'code': True, 'documentation': True},
                'backend_framework': 'Python',
                'database': 'MongoDB',
                'language': 'Python',
            },
            {
                'name': 'Sample Project: Portfolio Website',
                'description': 'A personal portfolio website showcasing projects, skills, and contact information.',
                'ai_tools': ['v0'],
                'target_users': 'students',
                'experience_level': 'beginner',
                'output_type': 'page',
                'expected_outputs': {'code': True, 'explanation': True},
                'frontend_framework': 'React',
                'styling': 'Tailwind CSS',
                'language': 'JavaScript',
            },
            {
                'name': 'Sample Project: Chat Application',
                'description': 'A real-time chat application with multiple rooms, user presence, and message history.',
                'ai_tools': ['v0', 'bolt', 'chatgpt'],
                'target_users': 'developers',
                'experience_level': 'advanced',
                'output_type': 'full_project',
                'expected_outputs': {'code': True, 'explanation': True, 'tests': True},
                'frontend_framework': 'React',
                'styling': 'Tailwind CSS',
                'backend_framework': 'Node.js',
                'database': 'PostgreSQL',
                'language': 'TypeScript',
            },
            {
                'name': 'Sample Project: Calculator Component',
                'description': 'A simple calculator component with basic arithmetic operations and keyboard support.',
                'ai_tools': ['bolt'],
                'target_users': 'students',
                'experience_level': 'beginner',
                'output_type': 'single_component',
                'expected_outputs': {'code': True},
                'frontend_framework': 'React',
                'styling': 'CSS',
                'language': 'JavaScript',
            },
            {
                'name': 'Sample Project: Task Management System',
                'description': 'A comprehensive task management system with teams, projects, and task assignments.',
                'ai_tools': ['v0', 'replit', 'claude'],
                'target_users': 'business',
                'experience_level': 'advanced',
                'output_type': 'full_project',
                'expected_outputs': {'code': True, 'explanation': True, 'documentation': True},
                'frontend_framework': 'Vue.js',
                'styling': 'Tailwind CSS',
                'backend_framework': 'Python',
                'database': 'PostgreSQL',
                'language': 'TypeScript',
            },
        ]

        # Create projects
        created_count = 0
        projects_to_create = min(count, len(sample_projects))
        
        for i in range(projects_to_create):
            project_data = sample_projects[i].copy()
            project_data['user'] = user
            
            # Check if project already exists
            existing = Project.objects.filter(
                user=user,
                name=project_data['name']
            ).first()
            
            if existing:
                self.stdout.write(self.style.WARNING(f'Skipping existing project: {project_data["name"]}'))
                continue
            
            project = Project.objects.create(**project_data)
            created_count += 1
            self.stdout.write(self.style.SUCCESS(f'Created: {project.name}'))

        self.stdout.write(self.style.SUCCESS(f'\nSuccessfully created {created_count} sample project(s) for {user.email}'))

