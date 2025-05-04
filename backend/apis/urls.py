from django.urls import path
from .views import UploadCSVView, PassengerListView, AllPassengersView, DeleteAllPassengersView

urlpatterns = [
    path('upload/', UploadCSVView.as_view(), name='upload-csv'),
    path('passengers/', PassengerListView.as_view(), name='passenger-list'),
    path('passengers/all/', AllPassengersView.as_view(), name='all-passengers'),
    path('passengers/delete_all/', DeleteAllPassengersView.as_view(), name='delete-all-passengers'),
]