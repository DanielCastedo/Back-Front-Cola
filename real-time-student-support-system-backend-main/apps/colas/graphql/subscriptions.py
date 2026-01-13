import strawberry
from typing import AsyncGenerator
from .types import ColaType
# Importamos el modelo para tipado, aunque aquí recibimos datos crudos de Redis
from apps.colas.models import Cola 

@strawberry.type
class Subscription:
    @strawberry.subscription
    async def vigilar_cola(self, info: strawberry.Info, cola_id: strawberry.ID) -> AsyncGenerator[ColaType, None]:
        ws = info.context["ws"]
        group_name = f"cola_{str(cola_id)}"

        async with ws.listen_to_channel("update_cola", groups=[group_name]) as cm:
            async for message in cm:
                if message.get("group") != group_name:
                    continue
                
                # message["data"] ahora es un DICCIONARIO simple
                if message["type"] == "update_cola":
                    data = message["data"]
                    yield ColaType(
                        id=data["id"],
                        nombre=data["nombre"],
                        numero_inicial=data["numero_inicial"],
                        numero_final=data["numero_final"],
                        numero_actual=data["numero_actual"],
                        numero_global=data["numero_global"],
                        Tipo=data["Tipo"]
                    )