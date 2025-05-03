from django.urls import path
from .views import UploadCSVView, PassengerListView

urlpatterns = [
    path('upload/', UploadCSVView.as_view(), name='upload-csv'),
    path('passengers/', PassengerListView.as_view(), name='passenger-list'),
]