from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Login
from .serializers import LoginSerializer  # ✅ Rename file to `serializers.py`


@api_view(['GET'])
def get_login(request):
    loginP = Login.objects.all()
    serializedData = LoginSerializer(loginP,many = True).data
    return Response(serializedData)

@api_view(['POST'])
def create_login(request):
    data = request.data
    serializer = LoginSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT','DELETE'])
def login_detail(request,pk):
    try:
        login = Login.objects.get(pk=pk)
    except Login.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'DELETE':
        login.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    elif request.method == 'PUT':
        data = request.data
        serializer = LoginSerializer(login, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




 