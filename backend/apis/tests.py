from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.core.files.uploadedfile import SimpleUploadedFile
from apis.models import Passenger
import os

# Create your tests here.
class PassengerAPITests(APITestCase):
    def setUp(self):
        self.upload_url = reverse("upload-csv")
        self.list_url = reverse("passenger-list")
        self.all_url = reverse("all-passengers")
        self.delete_url = reverse("delete-all-passengers")

    def create_test_file(self, content):
        return SimpleUploadedFile(
            "test.csv", content.encode("utf-8"), content_type="text/csv"
        )
    
    # Test CSV Upload
    def test_upload_valid_csv(self):
        content = "PassengerId,Survived,Pclass,Name,Sex,Age,SibSp,Parch,Ticket,Fare,Cabin,Embarked\n1,1,1,Test Person,male,30,0,0,1234,100,,S"
        file = self.create_test_file(content)
        response = self.client.post(self.upload_url, {"file": file}, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Passenger.objects.count(), 1)

    def test_upload_missing_file(self):
        response = self.client.post(self.upload_url, {}, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_upload_duplicate_passenger(self):
        content = "PassengerId,Survived,Pclass,Name,Sex,Age,SibSp,Parch,Ticket,Fare,Cabin,Embarked\n1,1,1,Test Person,male,30,0,0,1234,100,,S"
        file1 = self.create_test_file(content)
        file2 = self.create_test_file(content)
        self.client.post(self.upload_url, {"file": file1}, format="multipart")
        response = self.client.post(self.upload_url, {"file": file2}, format="multipart")
        self.assertEqual(Passenger.objects.count(), 1)
        self.assertEqual(response.data["skipped_duplicates"], 1)

    # Test Passenger List & Filters
    def test_list_passengers(self):
        Passenger.objects.create(passenger_id=1, survived=True, pclass=1, name="A", sex="male", age=30, sibsp=0, parch=0, ticket="123", fare=100)
        Passenger.objects.create(passenger_id=2, survived=False, pclass=3, name="B", sex="female", age=22, sibsp=0, parch=0, ticket="456", fare=50)

        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["count"], 2)

    def test_filter_passengers_by_sex(self):
        Passenger.objects.create(passenger_id=1, survived=True, pclass=1, name="A", sex="male", age=30, sibsp=0, parch=0, ticket="123", fare=100)
        Passenger.objects.create(passenger_id=2, survived=False, pclass=3, name="B", sex="female", age=22, sibsp=0, parch=0, ticket="456", fare=50)

        response = self.client.get(self.list_url + "?sex=female")
        self.assertEqual(len(response.data["results"]), 1)

    # Test Delete All
    def test_delete_all_passengers(self):
        Passenger.objects.create(passenger_id=1, survived=True, pclass=1, name="A", sex="male", age=30, sibsp=0, parch=0, ticket="123", fare=100)
        response = self.client.delete(self.delete_url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Passenger.objects.count(), 0)


