from django.contrib import admin
from .models import Passenger

# Register your models here.
@admin.register(Passenger)
class PassengerAdmin(admin.ModelAdmin):
    list_display = ['passenger_id', 'survived', 'pclass', 'name', 'sex', 'age', 'sibsp', 'parch', 'ticket', 'fare', 'cabin', 'embarked']