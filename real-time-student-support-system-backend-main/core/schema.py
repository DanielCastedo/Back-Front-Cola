import strawberry
from apps.colas.graphql.mutations import Mutation as ColasMutation
from apps.colas.graphql.subscriptions import Subscription as ColasSubscription
from apps.colas.graphql.queries import Query   # <-- IMPORTA la correcta, no la sobrescribas

class Mutation(ColasMutation):
    pass

class Subscription(ColasSubscription):
    pass

schema = strawberry.Schema(
    query=Query, 
    mutation=Mutation, 
    subscription=Subscription
)