import strawberry
from asgiref.sync import sync_to_async
from django.db import transaction
from channels.layers import get_channel_layer
from apps.colas.models import Cola
from .types import ColaType
from apps.colas.models import Tipo
from .types import TipoType


@sync_to_async
def crear_tipo_db(nombre):
    with transaction.atomic():
        tipo = Tipo.objects.create(nombre=nombre)
        return tipo
@sync_to_async
def editar_tipo_db(id, nombre):
    with transaction.atomic():
        tipo = Tipo.objects.select_for_update().get(pk=id)
        tipo.nombre = nombre
        tipo.save()
        return tipo

@sync_to_async
def eliminar_tipo_db(id):
    with transaction.atomic():
        tipo = Tipo.objects.get(pk=id)
        tipo.delete()
        return True
    
# 1. Función auxiliar para la BD (Síncrona)
@sync_to_async
def avanzar_turno_db(cola_id):
    with transaction.atomic():
        cola = Cola.objects.select_for_update().get(pk=cola_id)
        cola.numero_actual += 1
        cola.numero_global = cola.numero_actual
        cola.save()
        return cola
    
# @sync_to_async
# def crear_cola_db(numero_inicial, numero_final):
#     with transaction.atomic():
#         cola = Cola.objects.create(
#             nombre=f"Cola {Cola.objects.count() + 1}",
#             numero_inicial=numero_inicial,
#             numero_final=numero_final,
#             numero_actual=numero_inicial,
#             numero_global=numero_inicial,
#             Tipo_id=1  # Asignamos un Tipo por defecto (debes ajustarlo según tu lógica
#         )
#         return cola
    
@sync_to_async
def editar_cola_db(id, nombre, numero_inicial, numero_final, tipo_id):
    with transaction.atomic():
        cola = Cola.objects.select_for_update().get(pk=id)
        cola.nombre = nombre
        cola.numero_inicial = numero_inicial
        cola.numero_final = numero_final
        cola.Tipo_id = tipo_id
        cola.save()
        return cola

@sync_to_async
def eliminar_cola_db(id):
    with transaction.atomic():
        cola = Cola.objects.get(pk=id)
        cola.delete()
        return True
    
@sync_to_async
def crear_cola_db(nombre, numero_inicial, numero_final, tipo_id):
    with transaction.atomic():
        cola = Cola.objects.create(
            nombre=nombre,
            numero_inicial=numero_inicial,
            numero_final=numero_final,
            numero_actual=numero_inicial,
            numero_global=numero_inicial,
            Tipo_id=tipo_id
        )
        return cola

# 2. La clase Mutation (ESTO ES LO QUE TE FALTABA O ESTABA MAL NOMBRADO)
@strawberry.type
class Mutation:


    @strawberry.mutation
    async def crear_tipo(self, nombre: str) -> TipoType:
        tipo = await crear_tipo_db(nombre)
        return TipoType(id=tipo.id, nombre=tipo.nombre)

    @strawberry.mutation
    async def editar_tipo(self, id: strawberry.ID, nombre: str) -> TipoType:
        tipo = await editar_tipo_db(id, nombre)
        return TipoType(id=tipo.id, nombre=tipo.nombre)

    @strawberry.mutation
    async def eliminar_tipo(self, id: strawberry.ID) -> bool:
        await eliminar_tipo_db(id)
        return True
 
    @strawberry.mutation
    async def llamar_siguiente(self, cola_id: strawberry.ID) -> ColaType:
        cola = await avanzar_turno_db(cola_id)
        cola_data = {
            "id": cola.id,
            "nombre": cola.nombre,
            "numero_inicial": cola.numero_inicial,
            "numero_final": cola.numero_final,
            "numero_actual": cola.numero_actual,
            "numero_global": cola.numero_global,
            "Tipo": cola.Tipo_id
        }
        channel_layer = get_channel_layer()
        await channel_layer.group_send(
            f"cola_{str(cola.id)}",    # Usa cola.id obtenido del avance
            {   
                "type": "update_cola", 
                "group": f"cola_{str(cola.id)}",  
                "data": cola_data
            }
        )
        return ColaType(
            id=cola.id,
            nombre=cola.nombre,
            numero_inicial=cola.numero_inicial,
            numero_final=cola.numero_final,
            numero_actual=cola.numero_actual,
            numero_global=cola.numero_global,
            Tipo=cola.Tipo_id
        )

    @strawberry.mutation
    async def crear_cola(
        self,
        nombre: str,
        numero_inicial: int,
        numero_final: int,
        tipo_id: int,
    ) -> ColaType:
        cola = await crear_cola_db(nombre, numero_inicial, numero_final, tipo_id)
        return ColaType(
            id=cola.id,
            nombre=cola.nombre,
            numero_inicial=cola.numero_inicial,
            numero_final=cola.numero_final,
            numero_actual=cola.numero_actual,
            numero_global=cola.numero_global,
            Tipo=cola.Tipo_id,
        )

    @strawberry.mutation
    async def editar_cola(
        self,
        id: strawberry.ID,
        nombre: str,
        numero_inicial: int,
        numero_final: int,
        tipo_id: int,
    ) -> ColaType:
        cola = await editar_cola_db(id, nombre, numero_inicial, numero_final, tipo_id)
        return ColaType(
            id=cola.id,
            nombre=cola.nombre,
            numero_inicial=cola.numero_inicial,
            numero_final=cola.numero_final,
            numero_actual=cola.numero_actual,
            numero_global=cola.numero_global,
            Tipo=cola.Tipo_id
        )

    @strawberry.mutation
    async def eliminar_cola(
        self,
        id: strawberry.ID,
    ) -> bool:
        await eliminar_cola_db(id)
        return True