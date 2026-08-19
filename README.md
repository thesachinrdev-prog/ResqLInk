# 🚑 ResQLink — Emergency Response & Healthcare Dispatch System

A unified, real-time emergency healthcare dispatch frontend built with **React, Vite, and Tailwind CSS**. ResQLink connects three dedicated roles — **Patient, EMS Control Room, and Ambulance Driver** — into a synchronized emergency response workflow.

## ⚡ Key Features

* 🚨 **Instant SOS Activation** — One-touch emergency dispatch with categories:

  * Cardiac
  * Trauma
  * Respiratory
  * Stroke
* 📍 **Browser Geolocation** — Captures the patient's coordinates using the browser Geolocation API with graceful fallback handling.
* 🚑 **Automated Ambulance Dispatch Simulator** — Automatically assigns:

  * **Ambulance:** `TN 58 AB 1234`
  * **Driver:** `John Driver`
  * **ETA:** 5 minutes
* 🗺️ **Interactive Live Map** — Displays simulated route, countdown timer, distance indicator, driver information, and paramedic calling.
* 🔄 **Synchronized State Engine** — Uses `EmergencyContext` and `localStorage` to synchronize emergency state across all portals.
* 📱 **Responsive Dark UI** — Accessibility-focused interface optimized for mobile, tablet, and desktop.
* 📋 **Emergency History** — Completed emergencies are archived for later review.

---

## 🔄 Emergency Lifecycle

```text
Patient Portal
      │
      │ Trigger SOS + GPS
      ▼
Active Emergency Created
Status: SEARCHING AMBULANCE
      │
      ▼
EMS Control Room
Auto Assign / Manual Dispatch
      │
      ▼
Ambulance Driver
Accept Assignment
      │
      ▼
AMBULANCE ASSIGNED
ETA: 5 Minutes
      │
      ▼
Patient Portal
Live Map + Driver Information
      │
      ▼
Driver Telemetry
EN ROUTE
      │
      ▼
ARRIVED
      │
      ▼
PATIENT PICKED UP
      │
      ▼
COMPLETED
      │
      ▼
Emergency Resolved
      │
      ▼
Archived in Emergency History
```

---

# 🧭 Portal Architecture

## 1. 👤 Patient Portal

The Patient Portal provides a simple emergency interface for requesting immediate assistance.

### Features

* Giant **SOS** action button
* Emergency type selection
* Priority/triage indicators
* Browser GPS location capture
* Active emergency tracking
* Live ambulance ETA
* Driver information
* Emergency contacts
* Medical information
* Blood & prescription requests
* Notification center
* Emergency history
* Profile and settings
* Quick hospital dialers

### Sidebar Navigation

```text
Overview
Active Emergency
Blood & Rx Requests
Emergency Contacts
Medical Information
Profile
Notifications
Settings
```

### System Status

```text
System Online: 99.98%
Emergency Hotline: 108 / 911
```

---

## 2. 🖥️ EMS Control Room

The EMS Control Room acts as the central dispatch station.

### Features

* Live emergency feed
* Incoming distress alerts
* Emergency severity indicators
* Patient location details
* Ambulance assignment
* Manual dispatch controls
* ALS/BLS vehicle selection
* Fleet readiness monitoring
* Active emergency tracking

### Fleet Status

```text
IDLE
ASSIGNED
BUSY
```

---

## 3. 🚑 Ambulance Driver Console

The Driver Console provides the assigned ambulance driver with all information required to manage the emergency trip.

### Patient Information

* Blood type
* Age
* Emergency category
* Location
* Critical medical notes
* Emergency details

### Trip Progression

The driver can update the emergency through:

```text
EN ROUTE
     ↓
ARRIVED
     ↓
PATIENT PICKED UP
     ↓
COMPLETED
```

Each update is synchronized with the Patient and Control Room portals.

---

# 🛠️ Technology Stack

| Technology              | Purpose                        |
| ----------------------- | ------------------------------ |
| React                   | Frontend UI                    |
| Vite                    | Development and build tooling  |
| Tailwind CSS            | Styling and responsive design  |
| JavaScript              | Application logic              |
| React Context API       | Global emergency state         |
| localStorage            | Cross-portal state persistence |
| Browser Geolocation API | Patient location capture       |
| Lucide React            | Icons                          |
| HTML5                   | Application structure          |

---

# 📦 Project Architecture

A typical project structure can be organized as:

```text
resqlink-frontend/
│
├── public/
│
├── src/
│   ├── components/
│   │   ├── Patient/
│   │   ├── ControlRoom/
│   │   ├── Driver/
│   │   ├── Map/
│   │   └── common/
│   │
│   ├── context/
│   │   └── EmergencyContext.jsx
│   │
│   ├── pages/
│   │   ├── PatientPortal.jsx
│   │   ├── ControlRoom.jsx
│   │   └── DriverConsole.jsx
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

# 🚀 Quick Start

## 1. Prerequisites

Make sure the following are installed:

* **Node.js 18+**
* **npm**
* Git

Check your Node.js version:

```bash
node --version
```

Check npm:

```bash
npm --version
```

---

## 2. Clone the Repository

```bash
git clone https://github.com/your-org/resqlink-frontend.git
```

Navigate into the project:

```bash
cd resqlink-frontend
```

---

## 3. Install Dependencies

```bash
npm install
```

If required, install the main dependencies:

```bash
npm install lucide-react clsx tailwind-merge
```

---

## 4. Start the Development Server

```bash
npm run dev
```

The application will normally be available at:

```text
http://localhost:5173
```

Open the displayed URL in your browser.

---

# 🧪 Verification / Demo Walkthrough

The application can be demonstrated using the following workflow.

### Step 1 — Open Patient Portal

The Patient Portal is the default view.

Click:

```text
TRIGGER 🚨 SOS
```

---

### Step 2 — Select Emergency Type

Select one of the available emergency categories:

```text
Cardiac
Trauma
Respiratory
Stroke
```

Then click:

```text
CONFIRM SOS
```

---

### Step 3 — Emergency Created

The system creates an active emergency and displays:

```text
Emergency Alert Sent
Help is on the way
```

The browser attempts to obtain the patient's current coordinates using the Geolocation API.

---

### Step 4 — Ambulance Assignment

For demonstration purposes, the system automatically assigns an ambulance after approximately **3.5 seconds**.

Demo ambulance:

```text
Vehicle: TN 58 AB 1234
Driver: John Driver
ETA: 5 minutes
Distance: 2.4 km
```

The Live Map Modal opens automatically.

---

### Step 5 — Live Map

The Patient Portal displays:

* Simulated ambulance route
* Distance
* 5-minute countdown
* Driver information
* Emergency status
* Paramedic call button

---

### Step 6 — Control Room

Use the role switcher in the navigation bar and select:

```text
Control Room
```

The Control Room should display the incoming emergency and its current status.

---

### Step 7 — Driver Portal

Switch to:

```text
Driver
```

The assigned emergency should be visible.

Progress through the emergency using:

```text
EN ROUTE
     ↓
ARRIVED
     ↓
PATIENT PICKED UP
     ↓
COMPLETED
```

---

### Step 8 — Verify Resolution

Switch back to:

```text
Patient
```

The active emergency should be cleared after completion.

The completed emergency should appear in:

```text
Emergency Dispatch History
```

---

# 🔄 State Synchronization

ResQLink uses a shared emergency state architecture.

```text
                 ┌──────────────────┐
                 │ EmergencyContext │
                 └────────┬─────────┘
                          │
          ┌───────────────┼───────────────┐
          │               │               │
          ▼               ▼               ▼
     Patient Portal  Control Room   Driver Console
          │               │               │
          └───────────────┼───────────────┘
                          │
                          ▼
                    localStorage
```

The shared state contains information such as:

```text
Emergency ID
Patient information
Emergency type
Priority
GPS coordinates
Ambulance
Driver
ETA
Distance
Current status
Timestamp
```

This allows the three portals to reflect the same emergency lifecycle during the demonstration.

---

# 📍 Geolocation

ResQLink uses the browser's built-in Geolocation API:

```javascript
navigator.geolocation.getCurrentPosition()
```

The application handles cases where:

* Location permission is granted
* Location permission is denied
* Location is unavailable
* Browser geolocation fails

A fallback mechanism prevents the application from crashing when location access is unavailable.

> **Note:** Browser geolocation requires user permission and may require a secure context such as HTTPS in deployed environments.

---

# ⏱️ Dispatch Simulation

The project is designed primarily for **frontend demonstration and prototype validation**.

Instead of waiting five real minutes for ambulance allocation, the system simulates dispatch using a short delay:

```text
SOS Trigger
    ↓
3.5 second simulation
    ↓
Ambulance Assigned
    ↓
5-minute ETA simulation
```

This makes the complete emergency workflow easy to demonstrate during presentations, evaluations, and hackathons.

---

# 🎨 UI & Accessibility

ResQLink uses a high-contrast dark healthcare interface designed around emergency usability.

### Design Goals

* Clear emergency actions
* Large SOS controls
* High-contrast text
* Responsive layouts
* Clear status indicators
* Minimal navigation complexity
* Mobile-friendly interface
* Consistent emergency states

---

# 🔐 Safety & Prototype Disclaimer

ResQLink is a **frontend prototype / emergency response simulation** and should not be treated as a production emergency dispatch service.

The ambulance allocation, ETA, route, driver information, and emergency progression are simulated for demonstration purposes.

A production deployment would require integration with:

* Verified EMS infrastructure
* Emergency call centers
* Ambulance GPS telemetry
* Hospital systems
* Secure patient authentication
* Real-time backend infrastructure
* Medical data protection
* Production-grade mapping services
* Government/emergency service APIs

---

# 🚧 Future Enhancements

Potential production-level improvements include:

* 🤖 AI-based emergency severity prediction
* 🧠 Intelligent ambulance allocation
* 🗺️ Real-time GPS tracking
* 🚦 Traffic-aware ETA prediction
* 🏥 Nearest suitable hospital recommendation
* ❤️ IoT-based patient vital monitoring
* 📞 Real emergency service integration
* 🔔 Push notifications
* 🛰️ Real-time ambulance telemetry
* 🔐 Role-based authentication
* ☁️ Cloud backend
* 📊 EMS analytics dashboard
* 🧾 Digital emergency reports
* 🌐 Multi-language support
* 📱 Dedicated mobile applications

---

# 📊 Expected Impact

ResQLink aims to demonstrate how a unified digital platform can reduce communication gaps between:

```text
Patient
   ↕
EMS Control Room
   ↕
Ambulance Driver
   ↕
Hospital
```

The prototype focuses on **faster emergency communication, centralized dispatch visibility, synchronized status updates, and transparent ambulance tracking**.

---

# 👨‍💻 Development

Built using:

```text
React + Vite + Tailwind CSS
```

Designed as a real-time emergency healthcare dispatch prototype for demonstration, learning, and future production expansion.

---

# 📄 License

This project is intended for educational, prototype, and demonstration purposes.
