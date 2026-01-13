import strawberry
from typing import List, Optional
from asgiref.sync import sync_to_async
from apps.colas.models import Cola
from apps.colas.graphql.types import ColaType
from apps.colas.models import Tipo
from .types import TipoType

@strawberry.type
class Query:
    @strawberry.field
    async def tipos(self) -> List[TipoType]:
        tipos = await sync_to_async(list)(Tipo.objects.all())
        return [
            TipoType(id=tipo.id, nombre=tipo.nombre)
            for tipo in tipos
        ]

    @strawberry.field
    async def tipo(self, id: strawberry.ID) -> Optional[TipoType]:
        try:
            tipo = await sync_to_async(Tipo.objects.get)(pk=id)
            return TipoType(id=tipo.id, nombre=tipo.nombre)
        except Tipo.DoesNotExist:
            return None
        
    @strawberry.field
    async def colas(self) -> List[ColaType]:
        colas = await sync_to_async(list)(Cola.objects.all())
        return [
            ColaType(
                id=cola.id,
                nombre=cola.nombre,
                numero_inicial=cola.numero_inicial,
                numero_final=cola.numero_final,
                numero_actual=cola.numero_actual,
                numero_global=cola.numero_global,
                Tipo=cola.Tipo_id
            )
            for cola in colas
        ]

    @strawberry.field
    async def cola(self, id: strawberry.ID) -> Optional[ColaType]:
        try:
            cola = await sync_to_async(Cola.objects.get)(pk=id)
            return ColaType(
                id=cola.id,
                nombre=cola.nombre,
                numero_inicial=cola.numero_inicial,
                numero_final=cola.numero_final,
                numero_actual=cola.numero_actual,
                numero_global=cola.numero_global,
                Tipo=cola.Tipo_id
            )
        except Cola.DoesNotExist:
            return None