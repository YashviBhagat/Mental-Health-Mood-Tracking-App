from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from datetime import timedelta
from django.utils.timezone import now
from .models import Signup, MoodRating
from .serializers import SignupSerializer
from django.contrib.auth.hashers import check_password

@api_view(['GET'])
def get_signup(request):
    signupP = Signup.objects.all()
    serializedData = SignupSerializer(signupP, many=True).data
    return Response(serializedData)

@api_view(['POST'])
def create_signup(request):
    data = request.data
    serializer = SignupSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Signup successful! Redirect to Signin"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'DELETE'])
def signup_detail(request, pk):
    try:
        signup = Signup.objects.get(pk=pk)
    except Signup.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'DELETE':
        signup.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    elif request.method == 'PUT':
        data = request.data
        serializer = SignupSerializer(signup, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def signin_user(request):
    username = request.data.get("username")
    password = request.data.get("password")

    try:
        user = Signup.objects.get(username=username)

        if password == user.password:  # Not recommended for production (use password hashing)
            return Response({
                "message": "Signin successful",
                "user_id": user.id,
                "username": user.username
            }, status=200)
        else:
            return Response({"error": "Incorrect username or password"}, status=401)
    
    except Signup.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

@api_view(['POST'])
def submit_mood_rating(request):
    """
    Submits a mood rating and updates the user's streak.
    """
    user_id = request.data.get("user")
    mood = request.data.get("mood")
    rating = request.data.get("rating")

    try:
        user = Signup.objects.get(id=user_id)
        today = now().date()

        # Update mood ratings
        user.mood_ratings[mood] = rating

        # Handle streak updates
        if user.last_submission_date:
            if user.last_submission_date == today - timedelta(days=1):
                user.current_streak += 1
            elif user.last_submission_date < today - timedelta(days=1):
                user.current_streak = 1  # Reset streak

        user.longest_streak = max(user.longest_streak, user.current_streak)
        user.last_submission_date = today
        user.save()

        return Response({
            "message": "Mood rating submitted!",
            "current_streak": user.current_streak,
            "longest_streak": user.longest_streak,
            "mood_ratings": user.mood_ratings
        }, status=201)

    except Signup.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

@api_view(['GET'])
def get_user_mood_ratings(request, user_id):
    """
    Fetches all mood ratings for the logged-in user.
    """
    try:
        user = Signup.objects.get(id=user_id)
        return Response(user.mood_ratings)
    except Signup.DoesNotExist:
        return Response({"error": "User not found"}, status=404)


@api_view(['PUT'])
def update_mood_rating(request, rating_id):
    """
    Updates an existing mood rating.
    """
    try:
        mood_rating = MoodRating.objects.get(id=rating_id)
    except MoodRating.DoesNotExist:
        return Response({"error": "Mood rating not found"}, status=404)

    serializer = MoodRatingSerializer(mood_rating, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)

@api_view(['GET'])
def get_user_streaks(request, user_id):
    """
    Fetches the current and longest streak for a user.
    """
    try:
        user = Signup.objects.get(id=user_id)
        return Response({
            "current_streak": user.current_streak,
            "longest_streak": user.longest_streak,
            "last_submission_date": user.last_submission_date
        })
    except Signup.DoesNotExist:
        return Response({"error": "User not found"}, status=404)
