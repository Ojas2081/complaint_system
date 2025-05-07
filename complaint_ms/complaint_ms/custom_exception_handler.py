from rest_framework.exceptions import AuthenticationFailed
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status

def custom_exception_handler(exc, context):
    if isinstance(exc, AuthenticationFailed):
        return Response(
            {"detail": "Authentication credentials were not provided.", "redirect": "/"}, 
            status=status.HTTP_401_UNAUTHORIZED
        )
    return exception_handler(exc, context)
