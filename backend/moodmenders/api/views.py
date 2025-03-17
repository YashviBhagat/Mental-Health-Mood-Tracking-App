from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Signup  # Updated model name
from .serializers import SignupSerializer  # Updated serializer name
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
        return Response(serializer.data, status=status.HTTP_201_CREATED)
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

    print(f"Received Username: {username}, Password: {password}")  # Debugging

    try:
        user = Signup.objects.get(username=username)
        print(f"User found: {user.username}")  # Debugging

        if password == user.password:  # Compare password directly (NOT recommended for production)
            return Response({"message": "Signin successful"}, status=200)
        else:
            print("Incorrect password")  # Debugging
            return Response({"error": "Incorrect username or password"}, status=401)
    
    except Signup.DoesNotExist:
        print("User not found")  # Debugging
        return Response({"error": "User not found"}, status=404)