from rest_framework import serializers
from .models import Project, PlanMessage, StatusItem, Documentation


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'
        read_only_fields = ('user', 'created_at', 'updated_at')
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class ProjectListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ('id', 'name', 'description', 'created_at', 'updated_at', 'ai_tools', 'status', 'output_type', 'repository_name')
        read_only_fields = fields


class PlanMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlanMessage
        fields = '__all__'
        read_only_fields = ('project', 'created_at')


class StatusItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = StatusItem
        fields = '__all__'
        read_only_fields = ('project', 'created_at', 'updated_at')


class DocumentationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Documentation
        fields = '__all__'
        read_only_fields = ('project', 'generated_at', 'updated_at')

