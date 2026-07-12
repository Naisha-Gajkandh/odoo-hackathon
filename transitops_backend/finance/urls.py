from rest_framework.routers import DefaultRouter

from .views import ExpenseViewSet, FuelLogViewSet

router = DefaultRouter()
router.register("fuel-logs", FuelLogViewSet, basename="fuel-log")
router.register("expenses", ExpenseViewSet, basename="expense")
urlpatterns = router.urls
