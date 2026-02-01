# How to login as admin
admin mail -mastersivagiri@gmail.com,
admin password-8940203844.

# ✈️ Flight Booking Frontend (React + Tailwind)

Frontend for the Flight Booking system with:

✅ Login/Register (JWT)  
✅ Flight Search (AviationStack backend API)  
✅ Flight Results + Select Flight  
✅ Compare Price (Frontend-only)  
✅ Booking Details (Cancel / Checkout)  
✅ Razorpay Checkout + Verify  
✅ Download PDF + Print Itinerary  
✅ Admin UI (if enabled)  
✅ Deploy on Netlify  

---

## 📦 Tech Stack

- React
- React Router DOM
- Axios
- Tailwind CSS
- jsPDF (PDF itinerary)

---

## 📁 Suggested Folder Structure

frontend/
├── public/
│ └── _redirects
├── src/
│ ├── components/
│ │ ├── common/
│ │ │ ├── Loader.jsx
│ │ │ ├── Navbar.jsx
│ │ │ └── Footer.jsx
│ │ ├── flights/
│ │ │ ├── FlightSearchForm.jsx
│ │ │ ├── FlightCard.jsx
│ │ │ └── ComparePrice.jsx
│ │ ├── bookings/
│ │ └── admin/
│ ├── context/
│ │ └── AuthContext.jsx
│ ├── pages/
│ │ ├── Home.jsx
│ │ ├── Login.jsx
│ │ ├── Register.jsx
│ │ ├── SearchFlights.jsx
│ │ ├── BookingDetails.jsx
│ │ ├── MyBookings.jsx
│ │ ├── Checkout.jsx
│ │ └── AdminDashboard.jsx
│ ├── services/
│ │ ├── api.js
│ │ ├── auth.service.js
│ │ ├── flight.service.js
│ │ ├── booking.service.js
│ │ └── payment.service.js
│ ├── utils/
│ │ ├── itineraryPdf.js
│ │ ├── printItinerary.js
│ │ └── priceEngine.js
│ ├── App.jsx
│ └── main.jsx
└── package.json

yaml
Copy code

---

## ✅ Requirements

- Node.js >= 18
- Backend running (local or deployed)

Backend URL (your Render):
`https://flight-backend-9io6.onrender.com`

---

## ⚙️ Install & Run Locally

```bash
cd frontend
npm install
npm run dev
Frontend runs on:
✅ http://localhost:5173

🔌 Connect Frontend to Backend
✅ Option A (Recommended): use env variable
Create .env inside frontend/:

env
Copy code
VITE_API_URL=http://localhost:5000/api
Now in src/services/api.js:

js
Copy code
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
🚀 Deploy to Netlify
1) Add SPA redirect (React Router fix)
Create:

public/_redirects

bash
Copy code
/* /index.html 200
2) Netlify build settings
Build command:

bash
Copy code
npm run build
Publish directory:

nginx
Copy code
dist
3) Add environment variable on Netlify
Netlify → Site Settings → Environment Variables:

✅ VITE_API_URL

bash
Copy code
https://flight-backend-9io6.onrender.com/api
Redeploy after adding env var.

🧪 Testing Checklist
✅ 1. Login/Register
Register user

Login and confirm token is saved:

js
Copy code
localStorage.getItem("token")
✅ 2. Search flights
Use IATA codes:

From: MAA

To: DEL

✅ 3. Compare Price
Search flights

Click Compare Price

Switch cabin class (Economy / Business / First)

✅ 4. Booking Flow
Click Select

Booking created → navigate to checkout

✅ 5. Razorpay Payment (Test mode)
Use Razorpay test methods:

Card: 4111 1111 1111 1111

UPI: success@razorpay

✅ 6. Itinerary
In Booking Details:

Download PDF

Print itinerary

Packages Used
npm i axios react-router-dom jspdf
