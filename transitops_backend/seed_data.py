import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from accounts.models import User
from fleet.models import Vehicle
from drivers.models import Driver
from trips.models import Trip

def run_seed():
    print("Starting database seed...")

    # 1. Update Manager Name
    try:
        manager = User.objects.get(username="manager")
        manager.first_name = "Naisha"
        manager.last_name = "Gajkandh"
        manager.save()
        print("Updated Manager name to Naisha Gajkandh.")
    except User.DoesNotExist:
        print("Manager user not found, skipping name update.")

    # 2. Add Vehicles
    vehicles_data = [
        {"registration_number": "MH-01-AB-1234", "name_model": "Tata Ace", "vehicle_type": "Mini Truck", "max_load_capacity_kg": 750.0, "acquisition_cost": 500000.0, "region": "Maharashtra"},
        {"registration_number": "KA-04-CD-5678", "name_model": "Mahindra Bolero Pickup", "vehicle_type": "Pickup Truck", "max_load_capacity_kg": 1500.0, "acquisition_cost": 850000.0, "region": "Karnataka"},
        {"registration_number": "DL-09-EF-9012", "name_model": "Ashok Leyland Dost", "vehicle_type": "Light Commercial Vehicle", "max_load_capacity_kg": 2500.0, "acquisition_cost": 1200000.0, "region": "Delhi NCR"},
        {"registration_number": "TN-10-GH-3456", "name_model": "Tata 407", "vehicle_type": "Heavy Truck", "max_load_capacity_kg": 5000.0, "acquisition_cost": 1500000.0, "region": "Tamil Nadu"},
    ]
    
    for v_data in vehicles_data:
        Vehicle.objects.get_or_create(
            registration_number=v_data["registration_number"],
            defaults=v_data
        )
    print(f"Seeded {len(vehicles_data)} vehicles.")

    # 3. Add Drivers
    drivers_data = [
        {"name": "Rajesh Kumar", "license_number": "DL-1234567890", "contact_number": "+919876543210", "license_expiry_date": "2027-12-31", "license_category": "HMV"},
        {"name": "Amit Singh", "license_number": "UP-0987654321", "contact_number": "+918765432109", "license_expiry_date": "2028-05-15", "license_category": "LMV"},
        {"name": "Priya Sharma", "license_number": "MH-1122334455", "contact_number": "+917654321098", "license_expiry_date": "2026-10-20", "license_category": "LMV"},
        {"name": "Vijay Verma", "license_number": "KA-5544332211", "contact_number": "+916543210987", "license_expiry_date": "2025-08-11", "license_category": "HMV"},
    ]

    for d_data in drivers_data:
        Driver.objects.get_or_create(
            license_number=d_data["license_number"],
            defaults=d_data
        )
    print(f"Seeded {len(drivers_data)} drivers.")

    # 4. Add a sample draft trip for Indian locations
    try:
        v = Vehicle.objects.filter(status=Vehicle.Status.AVAILABLE).first()
        d = Driver.objects.filter(status=Driver.Status.AVAILABLE).first()
        
        if v and d:
            t, created = Trip.objects.get_or_create(
                trip_code="TR0001",
                defaults={
                    "trip_type": Trip.TripType.DELIVERY,
                    "source": "Mumbai, Maharashtra, India",
                    "destination": "Pune, Maharashtra, India",
                    "vehicle": v,
                    "driver": d,
                    "cargo_weight_kg": 500.0,
                    "planned_distance_km": 150.0,
                    "status": Trip.Status.DRAFT,
                }
            )
            if created:
                print("Seeded sample Indian trip TR0001 (Mumbai -> Pune).")
            else:
                print("Sample trip already exists.")
    except Exception as e:
        print(f"Error seeding trip: {e}")

    print("Database seeding completed successfully.")

if __name__ == "__main__":
    run_seed()
