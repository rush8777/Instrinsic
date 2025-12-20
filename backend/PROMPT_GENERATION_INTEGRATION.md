# Prompt Generation Integration Guide

## Overview
The Django backend has an endpoint ready to integrate with your Python prompt generation service.

## API Endpoint

**POST** `/api/projects/{project_id}/generate-prompts/`

This endpoint is called automatically when:
1. A new project is created via the wizard
2. The editor page loads a project with no content

## Endpoint Implementation

Located in: `backend/projects/views.py`

The `generate_prompts` action method receives the project data and should:
1. Call your Python prompt generation service
2. Generate prompts based on project configuration
3. Save the generated content to `project.content`
4. Return the updated project

## Project Data Structure

The endpoint receives a project with the following data:

```python
{
    'id': int,
    'name': str,
    'description': str,
    'ai_tools': list,  # ['v0', 'bolt', 'chatgpt', etc.]
    'target_users': str,  # 'students', 'developers', 'business', 'general'
    'experience_level': str,  # 'beginner', 'intermediate', 'advanced'
    'output_type': str,  # 'single_component', 'page', 'multi_page_app', etc.
    'expected_outputs': dict,  # {'code': bool, 'explanation': bool, etc.}
    'frontend_framework': str,  # 'React', 'Vue', etc.
    'styling': str,  # 'Tailwind CSS', etc.
    'backend_framework': str,  # 'Node.js', 'Python', etc.
    'database': str,  # 'PostgreSQL', 'MongoDB', etc.
    'language': str,  # 'TypeScript', 'JavaScript', etc.
}
```

## Integration Options

### Option 1: Import Python Module
If your prompt generator is a Python module:

```python
# In backend/projects/views.py
import sys
sys.path.append('/path/to/your/prompt_generator')
from prompt_generator import generate_prompts

@action(detail=True, methods=['post'])
def generate_prompts(self, request, pk=None):
    project = self.get_object()
    
    # Prepare project data
    project_data = {
        'name': project.name,
        'description': project.description,
        'ai_tools': project.ai_tools,
        # ... other fields
    }
    
    # Call your Python service
    generated_content = generate_prompts(project_data)
    
    # Save to project
    project.content = generated_content
    project.save()
    
    return Response({'message': 'Prompts generated successfully'})
```

### Option 2: HTTP Request
If your prompt generator runs as a separate service:

```python
import requests

@action(detail=True, methods=['post'])
def generate_prompts(self, request, pk=None):
    project = self.get_object()
    
    # Prepare project data
    project_data = {
        'name': project.name,
        'description': project.description,
        # ... other fields
    }
    
    # Call your Python service via HTTP
    response = requests.post(
        'http://localhost:8001/generate',  # Your Python service URL
        json=project_data,
        timeout=30
    )
    
    generated_content = response.json()['content']
    
    # Save to project
    project.content = generated_content
    project.save()
    
    return Response({'message': 'Prompts generated successfully'})
```

### Option 3: Subprocess
If your prompt generator is a standalone script:

```python
import subprocess
import json

@action(detail=True, methods=['post'])
def generate_prompts(self, request, pk=None):
    project = self.get_object()
    
    # Prepare project data
    project_data = {
        'name': project.name,
        'description': project.description,
        # ... other fields
    }
    
    # Call your Python script
    result = subprocess.run(
        ['python', '/path/to/prompt_generator.py'],
        input=json.dumps(project_data),
        capture_output=True,
        text=True,
        timeout=30
    )
    
    generated_content = json.loads(result.stdout)['content']
    
    # Save to project
    project.content = generated_content
    project.save()
    
    return Response({'message': 'Prompts generated successfully'})
```

## Expected Response Format

The generated content should be saved to `project.content` as a string. The frontend will display this in the BlogPost component.

## Testing

You can test the endpoint with:

```bash
curl -X POST http://localhost:8000/api/projects/1/generate-prompts/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

## Next Steps

1. Create your Python prompt generation service
2. Update the `generate_prompts` method in `backend/projects/views.py`
3. Test the integration
4. The frontend will automatically call this endpoint when needed

