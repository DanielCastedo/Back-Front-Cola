
import strawberry
from apps.colas.models import Cola

# @strawberry.django.type(Cola)
@strawberry.type
class ColaType:
    id: strawberry.ID
    nombre: str
    numero_inicial: int
    numero_final: int
    numero_actual: int
    numero_global: int
    Tipo: strawberry.ID

@strawberry.type
class TipoType:
    id: strawberry.ID
    nombre: str