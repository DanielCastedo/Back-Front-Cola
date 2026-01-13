from django.db import models
    
class Tipo(models.Model):
    nombre = models.CharField(max_length=100)  # Ej: "Proceso pago verano, pago de cup"

class Cola(models.Model):
    nombre = models.CharField(max_length=100)  # Ej: "Caja", "Inscripciones"
    numero_inicial = models.IntegerField(default=0) # El número inicial
    numero_final = models.IntegerField(default=0) # El número final
    numero_actual = models.IntegerField(default=0) # El número que se muestra en pantalla
    numero_global = models.IntegerField(default=0) # ticket global
    Tipo = models.ForeignKey('Tipo', on_delete=models.CASCADE)
    def __str__(self):
        return f"{self.nombre} - Turno: {self.numero_actual}"
    