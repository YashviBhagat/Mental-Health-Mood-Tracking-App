from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.utils.timezone import now
from django.views.decorators.csrf import csrf_exempt
from urllib.parse import unquote
import json
from django.db.models import Q
import hashlib
import base64
from .models import SavedText
from .models import SavedText  # ✅ Corrected imports
from .serializers import SavedTextSerializer#, LoginSerializer  # ✅ Corrected imports
from rest_framework.permissions import AllowAny
from .models import ChatMessage
from django.utils.decorators import method_decorator
from rest_framework.decorators import api_view, permission_classes  # ✅ Ensure this is imported
from rest_framework.permissions import AllowAny


# ✅ Save login data
@api_view(['POST'])
@csrf_exempt  # ❗ Disables CSRF for this endpoint
#@permission_classes([AllowAny])
def save_text(request):
    """Saves login data and returns JSON response."""
    try:
        username = request.data.get('username')
        if not username:
            return Response({"error": "Username is required"}, status=400)

        SavedText.objects.create(username=username)
        return Response({"message": "Saved successfully", "redirect": "/home"}, status=201)

    except Exception as e:
        return Response({"error": f"Internal Server Error: {str(e)}"}, status=500)



# ✅ Fetch the latest saved login text
@api_view(['GET'])
@csrf_exempt 
def get_texts(request):
    """Fetch the latest saved login text."""
    try:
        latest_login = SavedText.objects.latest('id')  
        serializer = SavedTextSerializer(latest_login)
        return Response(serializer.data, status=200)
    except SavedText.DoesNotExist:
        return Response({"error": "No login data found"}, status=404)


#usernames list for chat search
@api_view(['GET'])
def get_all_users(request):
    """Fetch all usernames from the database."""
    users = SavedText.objects.values("username")  # Fetch only usernames
    return Response(list(users), status=200)


#chat message storage

def generate_chat_id(user1, user2):
    """Generate a unique chat_id for a conversation between two users."""
    '''sorted_users = sorted([user1, user2])  # Ensure same order for both users
    return hashlib.sha256(f"{sorted_users[0]}_{sorted_users[1]}".encode()).hexdigest()'''
    sorted_users = sorted([user1, user2])  # Ensure same order for both users
    return hashlib.sha256(f"{sorted_users[0]}_{sorted_users[1]}".encode()).hexdigest()

#send message save data
@api_view(['POST'])
@permission_classes([AllowAny])  # ✅ No authentication required
def send_message(request):
    """Allow users to send messages correctly without duplicates."""
    try:
        data = request.data
        sender = data.get("username")
        receiver = data.get("selected_username")
        message = data.get("text")

        if not sender or not receiver or not message:
            return Response({"error": "Missing required fields"}, status=400)

        chat_id = f"{min(sender, receiver)}_{max(sender, receiver)}"  # ✅ Ensure consistent chat ID

        # ✅ Store only ONE message per send request
        ChatMessage.objects.create(
            chat_id=chat_id,
            username=sender,  # ✅ Correct sender
            selected_username=receiver,  # ✅ Correct receiver
            sent_text=message,  # ✅ Store only sent_text
            text_time=now()
        )

        return Response({"chat_id": chat_id, "message": "Message sent successfully"}, status=201)

    except Exception as e:
        print("🔥 Error in send_message:", str(e))
        return Response({"error": "Internal Server Error"}, status=500)


#get users list with whom chat history is present

@api_view(['GET'])
@permission_classes([AllowAny])  # ✅ No authentication required
def get_chat_users(request, username):
    """Fetch users with whom the logged-in user already has a chat."""
    try:
        # ✅ Fetch chats where the logged-in user is either sender or receiver
        chats = ChatMessage.objects.filter(
            Q(username=username) | Q(selected_username=username)
        ).values("chat_id").distinct()

        chat_users = []
        for chat in chats:
            last_message = ChatMessage.objects.filter(
                chat_id=chat["chat_id"]
            ).order_by("-text_time").first()

            if last_message:
                # ✅ Corrected logic to always show the OTHER user
                if last_message.username == username:
                    other_user = last_message.selected_username  # The person they sent the message to
                else:
                    other_user = last_message.username  # The person who sent the message

                chat_users.append({
                    "username": other_user,
                    "chat_id": chat["chat_id"],
                    "last_text_time": last_message.text_time
                })

        # ✅ Sort users by latest message time
        sorted_chat_users = sorted(chat_users, key=lambda x: x["last_text_time"], reverse=True)
        
        return Response(sorted_chat_users, status=200)

    except Exception as e:
        print("🔥 Error in get_chat_users:", str(e))
        return Response({"error": "Internal Server Error"}, status=500)


#get chat history

@api_view(['GET'])
@permission_classes([AllowAny])  # ✅ No authentication required
def get_chat(request, chat_id):
    """Fetch chat history between two users using chat_id."""
    try:
        messages = ChatMessage.objects.filter(chat_id=chat_id).order_by("text_time")

        if not messages.exists():
            return Response([])  # ✅ Return empty array if no messages exist

        chat_data = [
            {
                "sender": msg.username,
                "receiver": msg.selected_username,
                "text": msg.sent_text if msg.sent_text else "",  # ✅ Only show sent messages
                "timestamp": msg.text_time.strftime("%Y-%m-%d %H:%M:%S")
            }
            for msg in messages
        ]

        return Response(chat_data, status=200)

    except Exception as e:
        print("🔥 Error in get_chat:", str(e))
        return Response({"error": "Internal Server Error"}, status=500)
