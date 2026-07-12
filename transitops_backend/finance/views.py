"""
finance/views.py

FuelLogViewSet   — CRUD for vehicle fuel entries.
ExpenseViewSet   — CRUD for vehicle/trip expenses (toll, other).
"""

from __future__ import annotations

from rest_framework import viewsets
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.permissions import IsAuthenticated

from core.permissions import HasModulePermission

from .models import Expense, FuelLog
from .serializers import ExpenseSerializer, FuelLogSerializer


class FuelLogViewSet(viewsets.ModelViewSet):
    module = "fuel_exp"
    permission_classes = [IsAuthenticated, HasModulePermission]
    serializer_class = FuelLogSerializer
    filterset_fields = ["vehicle"]
    search_fields = ["vehicle__registration_number"]
    ordering_fields = ["date", "liters", "cost", "updated_at"]
    ordering = ["-date"]
    filter_backends = [*viewsets.ModelViewSet.filter_backends, SearchFilter, OrderingFilter]

    def get_queryset(self):
        return FuelLog.objects.select_related("vehicle").all()


class ExpenseViewSet(viewsets.ModelViewSet):
    module = "fuel_exp"
    permission_classes = [IsAuthenticated, HasModulePermission]
    serializer_class = ExpenseSerializer
    filterset_fields = ["vehicle", "trip", "status"]
    search_fields = ["vehicle__registration_number", "trip__trip_code", "reason"]
    ordering_fields = ["toll_cost", "other_cost", "status", "updated_at"]
    ordering = ["-updated_at"]
    filter_backends = [*viewsets.ModelViewSet.filter_backends, SearchFilter, OrderingFilter]

    def get_queryset(self):
        return Expense.objects.select_related("vehicle", "trip").all()
