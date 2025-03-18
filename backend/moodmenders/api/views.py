from django.contrib.auth.hashers import make_password, check_password
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import SignIn, SignUp, MoodRating, MoodStreak
from datetime import date
from .serializers import SignInSerializer, SignUpSerializer, MoodRatingSerializer, MoodStreakSerializer

@api_view(['POST'])
def signup(request):
    data = request.data

    # Hash password
    password = make_password(data['password'])
    username = data['username']

    sign_in = SignIn.objects.create(username=username, password=password)
    
    sign_up = SignUp.objects.create(
        user=sign_in,
        first_name=data.get('first_name', ''),
        last_name=data.get('last_name', ''),
        email=data.get('email', ''),
        date_of_birth=data.get('date_of_birth', None),
        gender=data.get('gender', ''),
        user_type=data.get('user_type', ''),
        licence_number=data.get('licence_number', ''),
        consultation_type=data.get('consultation_type', ''),
        about_me=data.get('about_me', '')
    )

    # Initialize Mood and Streak
    MoodRating.objects.create(user=sign_in)
    MoodStreak.objects.create(user=sign_in)
    
    return Response({"message": "User created successfully!"})

@api_view(['POST'])
def signin(request):
    data = request.data
    try:
        user = SignIn.objects.get(username=data['username'])
        if check_password(data['password'], user.password):
            return Response({"message": "Login successful", "user_id": user.user_id, "username": user.username})
        else:
            return Response({"error": "Invalid credentials"}, status=401)
    except SignIn.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

@api_view(['POST'])
def submit_mood(request):
    try:
        user_id = request.data.get('user_id')  # ✅ Use `.get()` to prevent KeyError
        if not user_id:
            return Response({"error": "User ID is required"}, status=400)

        try:
            user = SignIn.objects.get(user_id=user_id)
        except SignIn.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        # ✅ Save mood rating
        mood_rating = MoodRating.objects.create(
            user=user,
            happy=request.data.get("happy", 0),
            excited=request.data.get("excited", 0),
            sad=request.data.get("sad", 0),
            nervous=request.data.get("nervous", 0),
            worried=request.data.get("worried", 0),
            bored=request.data.get("bored", 0),
            angry=request.data.get("angry", 0),
        )

        # ✅ Update Streaks
        streak, created = MoodStreak.objects.get_or_create(user=user)
        last_entry = MoodRating.objects.filter(user=user).order_by('-date').first()

        if last_entry and last_entry.date == date.today():
            streak.current_streak += 1
            streak.longest_streak = max(streak.longest_streak, streak.current_streak)
        else:
            streak.current_streak = 1

        streak.last_submission_date = date.today()  # ✅ Ensure last submission date is updated
        streak.save()

        return Response({
            "message": "Mood rating submitted!",
            "streak": {
                "current_streak": streak.current_streak,
                "longest_streak": streak.longest_streak
            },
            "mood_rating": {
                "happy": mood_rating.happy,
                "excited": mood_rating.excited,
                "sad": mood_rating.sad,
                "nervous": mood_rating.nervous,
                "worried": mood_rating.worried,
                "bored": mood_rating.bored,
                "angry": mood_rating.angry
            }
        })

    except Exception as e:
        return Response({"error": str(e)}, status=500)


@api_view(['GET'])
def get_mood_ratings(request, user_id):
    ratings = MoodRating.objects.filter(user_id=user_id).order_by('-date')
    serializer = MoodRatingSerializer(ratings, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_user_profile(request, user_id):
    try:
        user = SignUp.objects.get(user__user_id=user_id)  # Fetch SignUp data linked to SignIn
        serializer = SignUpSerializer(user)
        return Response(serializer.data)
    except SignUp.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

