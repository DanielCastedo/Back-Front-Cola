from django.contrib import admin
from .models import Cola, Tipo

@admin.register(Cola)
class ColaAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre', 'numero_inicial', 'numero_final', 'numero_actual', 'numero_global', 'Tipo')
    search_fields = ('nombre', 'Tipo__nombre')

@admin.register(Tipo)
class TipoAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre')
    search_fields = ('nombre',)