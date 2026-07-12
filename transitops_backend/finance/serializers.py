"""
finance/serializers.py

FuelLogSerializer  — vehicle fuel entries (liters, cost, date).
ExpenseSerializer  — toll + other costs linked to a vehicle/trip.

Business rule: an expense linked to a cancelled trip is rejected (enforced
by Expense.clean() which is called explicitly in ExpenseSerializer.validate()).
"""

from __future__ import annotations

from rest_framework import serializers

from .models import Expense, FuelLog


class FuelLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = FuelLog
        fields = [
            "id",
            "vehicle",
            "date",
            "liters",
            "cost",
            "created_at",
            "updated_at",
        ]


class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = [
            "id",
            "trip",
            "vehicle",
            "toll_cost",
            "other_cost",
            "reason",
            "status",
            "created_at",
            "updated_at",
        ]

    def validate(self, attrs: dict) -> dict:
        # Runs Expense.clean() to enforce the "no expense on cancelled trip" rule
        instance = Expense(**attrs)
        instance.clean()
        return attrs
