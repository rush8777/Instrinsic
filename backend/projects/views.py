from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .models import Project, PlanMessage, StatusItem, Documentation
from .serializers import (
    ProjectSerializer, 
    ProjectListSerializer, 
    PlanMessageSerializer, 
    StatusItemSerializer, 
    DocumentationSerializer
)


class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['name', 'description']
    filterset_fields = ['status', 'output_type']
    
    def get_queryset(self):
        return Project.objects.filter(user=self.request.user, status__in=['active', 'archived'])
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ProjectListSerializer
        return ProjectSerializer
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['get'])
    def library(self, request, pk=None):
        project = self.get_object()
        # Example library structure - customize based on your needs
        return Response({
            'folders': [
                {
                    'id': 1,
                    'name': 'My Playlists',
                    'items': [
                        {
                            'id': 2,
                            'name': 'Chill Vibes Only',
                            'type': 'playlist'
                        },
                        {
                            'id': 3,
                            'name': 'Morning Boost',
                            'type': 'playlist'
                        }
                    ]
                },
                {
                    'id': 4,
                    'name': 'Shared',
                    'items': [
                        {
                            'id': 5,
                            'name': 'Sunday Brunch Tunes',
                            'type': 'playlist'
                        }
                    ]
                }
            ],
            'items': [
                {
                    'id': 6,
                    'name': 'Daily Discover',
                    'type': 'playlist'
                },
                {
                    'id': 7,
                    'name': 'New Releases',
                    'type': 'playlist'
                },
                {
                    'id': 8,
                    'name': 'Liked Songs',
                    'type': 'playlist'
                }
            ]
        })
    
    @action(detail=True, methods=['post'], url_path='generate-prompts')
    def generate_prompts(self, request, pk=None):
        """
        Generate prompts for a project using the Python prompt generation service.
        This endpoint will call your Python service to generate prompts based on project data.
        """
        try:
            project = self.get_object()
            
            # Prepare project data for your Python service
            import json
            project_data = {
                'id': project.id,
                'name': project.name or 'Untitled Project',
                'description': project.description or '',
                'ai_tools': project.ai_tools or [],
                'target_users': project.target_users or '',
                'experience_level': project.experience_level or '',
                'output_type': project.output_type or '',
                'expected_outputs': project.expected_outputs or {},
                'frontend_framework': project.frontend_framework or '',
                'styling': project.styling or '',
                'backend_framework': project.backend_framework or '',
                'database': project.database or '',
                'language': project.language or '',
            }
            
            # TODO: Integrate with your Python prompt generation service
            # Example integration options:
            #
            # Option 1: Import as module
            # from prompt_generator import generate_prompts
            # generated_content = generate_prompts(project_data)
            #
            # Option 2: HTTP request to separate service
            # import requests
            # response = requests.post('http://localhost:8001/generate', json=project_data)
            # generated_content = response.json()['content']
            #
            # Option 3: Subprocess call
            # import subprocess
            # result = subprocess.run(['python', 'path/to/prompt_generator.py'], 
            #                          input=json.dumps(project_data),
            #                          capture_output=True, text=True)
            # generated_content = json.loads(result.stdout)['content']
            
            # Placeholder - replace with actual generated content
            generated_content = f"""<h1>{project.name or 'Untitled Project'}</h1>
<p>{project.description or 'No description provided'}</p>
<p><strong>AI Tools:</strong> {', '.join(project.ai_tools) if project.ai_tools else 'None selected'}</p>
<p><strong>Target Users:</strong> {project.target_users or 'Not specified'}</p>
<p><strong>Experience Level:</strong> {project.experience_level or 'Not specified'}</p>
<p><strong>Output Type:</strong> {project.output_type or 'Not specified'}</p>
<p><strong>Note:</strong> Integrate with your Python prompt generation service to generate actual prompts.</p>"""
            
            # Save generated content to project
            project.content = generated_content
            project.save()
            
            serializer = self.get_serializer(project)
            return Response({
                'message': 'Prompts generated successfully',
                'project': serializer.data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'error': str(e),
                'message': 'Failed to generate prompts'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Plans/Chat endpoints
    @action(detail=True, methods=['get', 'post'], url_path='plans/messages')
    def plans_messages(self, request, pk=None):
        project = self.get_object()
        
        if request.method == 'GET':
            messages = PlanMessage.objects.filter(project=project).order_by('created_at')
            serializer = PlanMessageSerializer(messages, many=True)
            return Response(serializer.data)
        
        elif request.method == 'POST':
            serializer = PlanMessageSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(project=project)
                # TODO: Generate assistant response using AI
                # For now, just return the user message
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Status/Todos endpoints
    @action(detail=True, methods=['get', 'post'], url_path='status/items')
    def status_items(self, request, pk=None):
        project = self.get_object()
        
        if request.method == 'GET':
            items = StatusItem.objects.filter(project=project).order_by('-created_at')
            serializer = StatusItemSerializer(items, many=True)
            return Response(serializer.data)
        
        elif request.method == 'POST':
            serializer = StatusItemSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(project=project)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['patch'], url_path='status/items/(?P<item_id>[^/.]+)')
    def update_status_item(self, request, pk=None, item_id=None):
        project = self.get_object()
        try:
            item = StatusItem.objects.get(id=item_id, project=project)
            serializer = StatusItemSerializer(item, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except StatusItem.DoesNotExist:
            return Response(
                {'error': 'Status item not found'},
                status=status.HTTP_404_NOT_FOUND
            )

    # Documentation endpoints
    @action(detail=True, methods=['get'], url_path='docs')
    def docs(self, request, pk=None):
        project = self.get_object()
        try:
            documentation = Documentation.objects.get(project=project)
            serializer = DocumentationSerializer(documentation)
            return Response(serializer.data)
        except Documentation.DoesNotExist:
            return Response(
                {'error': 'Documentation not found'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=True, methods=['post'], url_path='docs/initialize')
    def initialize_docs(self, request, pk=None):
        project = self.get_object()
        
        # TODO: Generate documentation from repository
        # For now, create a placeholder structure
        file_tree = [
            {
                'name': 'src',
                'type': 'directory',
                'description': 'Source code directory',
                'children': [
                    {
                        'name': 'components',
                        'type': 'directory',
                        'description': 'React components',
                        'children': []
                    },
                    {
                        'name': 'pages',
                        'type': 'directory',
                        'description': 'Page components',
                        'children': []
                    }
                ]
            },
            {
                'name': 'README.md',
                'type': 'file',
                'description': 'Project documentation and setup instructions'
            }
        ]
        
        documentation, created = Documentation.objects.get_or_create(
            project=project,
            defaults={'file_tree': file_tree}
        )
        
        if not created:
            documentation.file_tree = file_tree
            documentation.save()
        
        serializer = DocumentationSerializer(documentation)
        return Response(serializer.data, status=status.HTTP_200_OK)

