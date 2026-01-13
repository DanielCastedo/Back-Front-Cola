from django.urls import re_path
from strawberry.channels import GraphQLWSConsumer
from .schema import schema

websocket_urlpatterns = [
    # Esta es la línea que soluciona tu ImportError.
    # Usamos el Consumer oficial de Strawberry
    re_path(r"^graphql/?$", GraphQLWSConsumer.as_asgi(schema=schema)),
]