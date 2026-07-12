# TransitOps - Fleet & Logistics Management System

TransitOps is a modern, comprehensive Fleet and Logistics Management System built for the Odoo Hackathon. It provides a centralized dashboard to track vehicles, manage drivers, dispatch trips, monitor maintenance schedules, and analyze fuel expenses. 

The application is built with a decoupled architecture featuring a **React** frontend and a **Django REST Framework (DRF)** backend, providing a scalable and responsive experience for logistics operators, fleet managers, and dispatchers.

## 🚀 Key Features

*   **Role-Based Access Control (RBAC):** Distinct dashboards and access levels for Fleet Managers, Dispatchers, Safety Officers, and Financial Analysts.
*   **Live Trip Dispatching:** Create, assign, and track trips. Automatically calculate cargo weight limits and display route ETA using OSRM routing fallbacks.
*   **Fleet & Vehicle Registry:** Comprehensive tracking of fleet health, capacity, vehicle specifications, and real-time statuses (On Trip, Maintenance, Available).
*   **Driver Management:** Track driver licenses, safety scores, duty statuses, and display dynamically generated avatars based on gender and profile data.
*   **Maintenance Logs:** Manage vehicle repairs, routine checkups, and record maintenance expenses.
*   **Analytics & Reporting:** Visualized metrics for fuel expenses (in ₹), trip completion rates, driver safety scores, and overall fleet utilization.

## 🛠️ Technology Stack

### Frontend
*   **React 18** (via Vite)
*   **Tailwind CSS** (for styling and modern UI components)
*   **React Router** (for SPA navigation)
*   **React Hook Form** (for robust form validation)
*   **Axios** (for API communication)
*   **React Hot Toast** (for notifications)
*   **Chart.js / Recharts** (for data visualization)

### Backend
*   **Django 5.x** 
*   **Django REST Framework (DRF)** (for RESTful APIs)
*   **SQLite** (default database for local development)
*   **Django FSM** (Finite State Machine for trip lifecycle management)
*   **JWT Authentication** (SimpleJWT for secure token-based auth)

## ⚙️ Local Setup & Installation

### Prerequisites
*   Node.js (v18+)
*   Python (3.10+)

### 1. Backend Setup

Navigate to the backend directory and set up the Python environment:

```bash
cd transitops_backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations
python manage.py migrate

# (Optional) Seed the database with initial mock data
python seed_data.py

# Start the Django development server
python manage.py runserver
```
*The backend will be available at `http://127.0.0.1:8000`*

### 2. Frontend Setup

Open a new terminal window, navigate to the frontend directory, and start the Vite development server:

```bash
cd frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```
*The frontend will be available at `http://localhost:5173`*

## 🧑‍💻 Usage

1. Open your browser and navigate to the frontend URL (e.g., `http://localhost:5173`).
2. Log in using one of the preset roles on the Login screen (e.g., Fleet Manager).
3. Navigate through the sidebar to explore Dashboard KPIs, Dispatch Trips, view the Vehicle Registry, or analyze Fuel Expenses.

## 📝 License

This project was developed for the Odoo Hackathon. All rights reserved.
