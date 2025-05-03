from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.files.storage import default_storage
import pandas as pd
from .models import Passenger


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
