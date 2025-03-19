

from rest_framework import serializers
from .models import SavedText, NewNote#, Login  # ✅ Ensure correct imports

class NewNoteSerializer(serializers.ModelSerializer):  
    class Meta:
        model = NewNote  
        fields = '__all__'  # ✅ Include all fields


class SavedTextSerializer(serializers.ModelSerializer):  
    class Meta:
        model = SavedText  
        fields = '__all__'  # ✅ Include all fields

