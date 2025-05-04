from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.files.storage import default_storage
import pandas as pd
from rest_framework import generics
from .models import Passenger
from .serializers import PassengerSerializer
from rest_framework.filters import OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
import django_filters


# Create your views here.
class UploadCSVView(APIView):
    def post(self, request):
        file = request.FILES.get('file')
        if not file:
            return Response({"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        file_path = default_storage.save(file.name, file)

        try:
            df = pd.read_csv(file_path)
            new_records = 0
            skipped = 0

            for _, row in df.iterrows():
                passenger_id = row['PassengerId']
                if Passenger.objects.filter(passenger_id=passenger_id).exists():
                    skipped += 1
                    continue
                Passenger.objects.create(
                    passenger_id=passenger_id,
                    survived=bool(row['Survived']),
                    pclass=row['Pclass'],
                    name=row['Name'],
                    sex=row['Sex'],
                    age=row['Age'] if pd.notnull(row['Age']) else None,
                    sibsp=row['SibSp'],
                    parch=row['Parch'],
                    ticket=row['Ticket'],
                    fare=row['Fare'],
                    cabin=row['Cabin'] if pd.notnull(row['Cabin']) else None,
                    embarked=row['Embarked'] if pd.notnull(row['Embarked']) else None,
                )
                new_records += 1
            return Response({
                "status": "Upload completed",
                "new_records": new_records,
                "skipped_duplicates": skipped
            })
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PassengerFilter(django_filters.FilterSet):
    sex = django_filters.CharFilter(field_name="sex", lookup_expr="iexact")
    survived = django_filters.BooleanFilter(field_name="survived")
    pclass = django_filters.NumberFilter(field_name="pclass")

    class Meta:
        model = Passenger
        fields = ['sex', 'survived', 'pclass']

class PassengerListView(generics.ListAPIView):
    queryset = Passenger.objects.all()
    serializer_class = PassengerSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = PassengerFilter
    ordering_fields = ['age', 'fare']

class AllPassengersView(APIView):
    """
    Return ALL passengers matching filters (no pagination).
    Intended for charting purposes.
    """
    def get(self, request):
        queryset = Passenger.objects.all()

        # Apply filters
        sex = request.GET.get("sex")
        survived = request.GET.get("survived")
        pclass = request.GET.get("pclass")

        if sex:
            queryset = queryset.filter(sex__iexact=sex)
        if survived in ("true", "false"):
            queryset = queryset.filter(survived=(survived == "true"))
        if pclass:
            queryset = queryset.filter(pclass=pclass)

        serializer = PassengerSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)