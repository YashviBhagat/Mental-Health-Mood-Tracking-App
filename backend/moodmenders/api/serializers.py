

from rest_framework import serializers
from .models import SavedText #, Login  # ✅ Ensure correct imports


class SavedTextSerializer(serializers.ModelSerializer):  
    class Meta:
        model = SavedText  
        fields = '__all__'  # ✅ Include all fields

