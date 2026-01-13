import os
from django.core.asgi import get_asgi_application

# Configura las settings de Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

# Inicializa la aplicación ASGI de Django (HTTP) antes de importar Channels
# Esto evita errores de "Apps not loaded"
django_asgi_app = get_asgi_application()

from channels.routing import ProtocolTypeRouter, URLRouter
# from channels.auth import AuthMiddlewareStack
# from channels.security.websocket import AllowedHostsOriginValidator

# Importamos las rutas de websocket (que crearemos en el siguiente paso) 
from .routing import websocket_urlpatterns

application = ProtocolTypeRouter(
    {
        # 1. Tráfico HTTP normal (vistas de Django)
        "http": django_asgi_app,
        
        # 2. Tráfico WebSocket (Chat, notificaciones, etc.)
        # "websocket": 
            # AllowedHostsOriginValidator(
            # AuthMiddlewareStack(
                # URLRouter(
                #     routing.websocket_urlpatterns
                    
                # )
            # )
        # ),
        "websocket": URLRouter(websocket_urlpatterns),
    }
)