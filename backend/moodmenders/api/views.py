from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from datetime import timedelta
from django.utils.timezone import now
from .models import Feedback, Signup, MoodRating,MeditationSession,Journal
from .serializers import MoodRatingSerializer, SignupSerializer,FeedbackSerializer,JournalSerializer
from django.contrib.auth.hashers import check_password
from django.http import JsonResponse


@api_view(['GET'])
def get_signup(request):
    signupP = Signup.objects.all()
    serializedData = SignupSerializer(signupP, many=True).data
    return Response(serializedData)

@api_view(['POST'])
def create_signup(request):
    """ Handles user registration with password hashing """
    serializer = SignupSerializer(data=request.data)
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
    """ Handles user authentication with password verification """
    username = request.data.get("username")
    password = request.data.get("password")

    try:
        user = Signup.objects.get(username=username)
        if check_password(password, user.password):  
            return Response({"message": "Signin successful", "user_id": user.id, "username": user.username}, status=200)
        else:
            return Response({"error": "Incorrect username or password"}, status=401)
    except Signup.DoesNotExist:
        return Response({"error": "User not found"}, status=404)


@api_view(['POST'])
def submit_mood_rating(request):
    """ Handles mood rating submission and updates streak """
    user_id = request.data.get("user")
    mood = request.data.get("mood")
    rating = request.data.get("rating")

    try:
        user = Signup.objects.get(id=user_id)
        today = now().date()
        print(user.last_submission_date)

        # Check if last submission date exists
        if user.last_submission_date:
            days_since_last_submission = (today - user.last_submission_date).days
        else:
            days_since_last_submission = None

        #Update streak based on last submission date
        if days_since_last_submission == 1:
            user.current_streak += 1  # Increase streak if submitted yesterday
        elif days_since_last_submission is None or days_since_last_submission > 1:
            user.current_streak = 1  # Reset streak if skipped a day or first time

        # Update longest streak if current streak is higher
        user.longest_streak = max(user.longest_streak, user.current_streak)

        # Update last submission date
        user.last_submission_date = today
        user.save()

        # Save mood rating in database
        MoodRating.objects.create(user=user, mood=mood, rating=rating)

        return Response({
            "message": "Mood rating submitted!",
            "current_streak": user.current_streak,
            "longest_streak": user.longest_streak,
            "last_submission_date": str(user.last_submission_date)
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
    
@api_view(["GET"])  # Ensures this view only allows GET requests
def get_user_moods(request, user_id):
    try:
        user = Signup.objects.get(id=user_id)
        moods = MoodRating.objects.filter(user=user).values("mood", "rating")

        # Convert query results into a dictionary format
        mood_data = {mood["mood"]: {"rating": mood["rating"]} for mood in moods}

        return JsonResponse(mood_data)  # Returns { "Happy": {"rating": 4}, "Sad": {"rating": 2} }
    except Signup.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)


from django.contrib.auth.hashers import make_password

@api_view(['PUT'])
def update_user(request, user_id):
    """Allows users to update their first name, last name, email, and password"""
    try:
        user = Signup.objects.get(id=user_id)
    except Signup.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    data = request.data

    # Convert camelCase to snake_case
    first_name = data.get("firstName")
    last_name = data.get("lastName")
    email = data.get("email")
    password = data.get("password")

    if first_name:
        user.first_name = first_name
    if last_name:
        user.last_name = last_name
    if email:
        user.email = email

    # Manually hash the password before saving
    if password:
        user.password = make_password(password)  # Hash password manually

    user.save()

    return Response({
        "message": "Profile updated successfully!",
        "firstName": user.first_name,
        "lastName": user.last_name,
        "email": user.email
    }, status=status.HTTP_200_OK)


@api_view(["POST"])

def submit_feedback(request, user_id):
    """API to submit feedback (rating + experience text)"""
    # user_id = request.user.id  # Get logged-in user from token
    rating = request.data.get("rating")  # Get rating from request
    comment = request.data.get("comment", "")  # Get experience text

    # Check if user exists
    try:
        user = Signup.objects.get(id=user_id)  # Fetch correct user
    except Signup.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

    # Create feedback entry
    feedback = Feedback.objects.create(user=user, rating=rating, comment=comment)
    return Response({"message": "Feedback submitted successfully!", "feedback_id": feedback.id}, status=201)
    



@api_view(["POST"])
def save_session(request):
    """Save meditation session duration"""
    user = request.data.get("user_id")  # Replace with actual logged-in user
    duration = request.data.get("duration")

    if not duration:
        return Response({"error": "Duration required"}, status=400)

    MeditationSession.objects.create(user=user, duration=duration)
    return Response({"message": "Meditation session saved successfully!"}, status=201)


# Get all journal entries for a user
@api_view(['GET'])
def get_journals(request, user_id):
    try:
        user = Signup.objects.get(id=user_id)
        journals = Journal.objects.filter(user=user).order_by('-last_updated')
        serializer = JournalSerializer(journals, many=True)
        return Response(serializer.data, status=200)
    except Signup.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

# Add a new journal entry
@api_view(['POST'])
def add_journal(request):
    user_id = request.data.get("user_id")
    title = request.data.get("title", "")
    description = request.data.get("description", "")

    try:
        user = Signup.objects.get(id=user_id)
        journal = Journal.objects.create(user=user, title=title, description=description)
        return Response({"message": "Journal added successfully!", "journal_id": journal.id}, status=201)
    except Signup.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

#  Update an existing journal entry
@api_view(['PUT'])
def update_journal(request, journal_id):
    try:
        journal = Journal.objects.get(id=journal_id)
        data = request.data

        journal.title = data.get("title", journal.title)
        journal.description = data.get("description", journal.description)
        journal.last_updated = now()
        journal.save()

        return Response({"message": "Journal updated successfully!"}, status=200)
    except Journal.DoesNotExist:
        return Response({"error": "Journal not found"}, status=404)

#  Delete a journal entry
@api_view(['DELETE'])
def delete_journal(request, journal_id):
    """Delete a journal entry by ID"""
    try:
        journal = Journal.objects.get(id=journal_id)
        journal.delete()
        return Response({"message": "Journal deleted successfully!"}, status=status.HTTP_200_OK)
    except Journal.DoesNotExist:
        return Response({"error": "Journal not found"}, status=status.HTTP_404_NOT_FOUND)