from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.utils.timezone import now
from django.views.decorators.csrf import csrf_exempt
from urllib.parse import unquote
import json

from .models import SavedText, NewNote  # ✅ Corrected imports
from .serializers import SavedTextSerializer, NewNoteSerializer#, LoginSerializer  # ✅ Corrected imports


# ✅ Save login data
@api_view(['POST'])
def save_text(request):
    """Saves login data and returns JSON response."""
    try:
        print("📥 Incoming request data:", request.data)  

        username = request.data.get('username', None)

        if not username:
            return Response({"error": "Username is required"}, status=400)

        print("✅ Saving to database:", username)
        SavedText.objects.create(username=username)  

        return Response({"message": "Saved successfully", "redirect": "/home"})

    except Exception as e:
        print("🔥 Server error:", str(e))  
        return Response({"error": f"Internal Server Error: {str(e)}"}, status=500)


# ✅ Fetch the latest saved login text
@api_view(['GET'])
def get_texts(request):
    """Fetch the latest saved login text."""
    try:
        latest_login = SavedText.objects.latest('id')  
        serializer = SavedTextSerializer(latest_login)
        return Response(serializer.data, status=200)
    except SavedText.DoesNotExist:
        return Response({"error": "No login data found"}, status=404)


# ✅ Save a new note
@api_view(['POST'])
def save_new_note(request):
    """Saves a new note under the latest logged-in username."""
    try:
        print("\n📥 Incoming request:", request.data)  # ✅ Debugging request data

        username = request.data.get('username')
        title = request.data.get('title', "")
        description = request.data.get('description', "")

        if not username:
            print("🚨 ERROR: username is missing!")
            return Response({"error": "Username is required"}, status=400)

        # ✅ Step 1: Save note first (without user_note)
        new_note = NewNote.objects.create(
            username=username,
            title=title,
            description=description
        )

        # ✅ Step 2: Retrieve the ID from the database
        new_note.refresh_from_db()  # 🚀 Fetches the assigned ID

        # ✅ Step 3: Now, generate user_note using the assigned ID
        new_note.user_note = f"{username} - {new_note.id}"
        new_note.save(update_fields=['user_note'])  # ✅ Save again after setting user_note

        print("✅ SUCCESS: Note saved:", new_note)

        return Response({"message": "Note saved successfully", "note_id": new_note.id}, status=201)

    except Exception as e:
        print("🔥 SERVER ERROR:", str(e))
        return Response({"error": f"Internal Server Error: {str(e)}"}, status=500)

# ✅ Fetch all notes for the logged-in user
@api_view(['GET'])
def get_notes(request):
    """Fetch all notes for the currently logged-in username."""
    try:
        latest_login = SavedText.objects.latest('id')  
        notes = NewNote.objects.filter(username=latest_login.username).order_by('-last_updated')  
        serializer = NewNoteSerializer(notes, many=True)

        return Response(serializer.data, status=200)
    
    except SavedText.DoesNotExist:
        return Response({"error": "No logged-in user found"}, status=400)


# ✅ Retrieve a specific note by user_note
@csrf_exempt
@require_http_methods(["GET"])
def retrieve_note(request):
    user_note = request.GET.get("user_note")

    print(f"🔍 Received user_note: {user_note}")

    if not user_note:
        return JsonResponse({"error": "Missing user_note parameter"}, status=400)

    try:
        user_note = unquote(user_note).strip()  
        print(f"🔎 Searching for user_note: '{user_note}'")

        note = NewNote.objects.get(user_note__iexact=user_note)  
        print(f"✅ Found note: {note.title}")

        return JsonResponse({
            "title": note.title,
            "description": note.description,
            "last_updated": note.last_updated.strftime("%d %B %Y")
        }, status=200)

    except NewNote.DoesNotExist:
        print("❌ Note not found!")  
        return JsonResponse({"error": "Note not found"}, status=404) 


# ✅ Update a retrieved note
@csrf_exempt
@require_http_methods(["PUT"])
def update_note(request):
    try:
        user_note = request.GET.get("user_note")
        if not user_note:
            return JsonResponse({"error": "Missing user_note parameter"}, status=400)

        note = NewNote.objects.get(user_note=user_note)  
        data = json.loads(request.body.decode("utf-8"))

        new_title = data.get("title", note.title)  
        new_description = data.get("description", note.description)

        note.title = new_title
        note.description = new_description
        note.last_updated = now()  # ✅ Update timestamp
        note.save()

        return JsonResponse({"message": "Note updated successfully!"}, status=200)

    except NewNote.DoesNotExist:
        return JsonResponse({"error": "Note not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
