# 🧳 TripLedger — Smart Travel Budget & Itinerary Planner

A production-level React SPA for solo travelers to plan trips, track expenses against budgets, convert currencies in real time, and check destination weather forecasts — all in one place.

**Course**: Building Web Applications with React | **Batch**: 2029

---

## ✨ Features

| Feature | Description | React Concepts |
|---------|-------------|----------------|
| 🔐 **Authentication** | Email/password + Google sign-in | Context API, `useEffect`, conditional rendering |
| 🗺️ **Trip Management** | Create, edit, delete trips with destinations | `useReducer`, CRUD, list rendering |
| 💸 **Expense Tracking** | Track spending by category in real time | `useMemo`, custom hooks, controlled forms |
| 💱 **Currency Converter** | Live rates from 30+ currencies | `useEffect` with cleanup, API integration |
| 🌤️ **Weather Forecast** | 7-day forecast for trip destinations | Custom hook, conditional fetching |
| 📊 **Budget Dashboard** | Pie charts, progress bars, stat cards | `useMemo`, Recharts, component composition |

---

## 🛠 Tech Stack

- **React 18** + **Vite** (build tool)
- **react-router-dom v6** — `createBrowserRouter`, nested routes, lazy loading
- **Firebase v9** (modular SDK) — Authentication + Cloud Firestore
- **Recharts** — Expense pie charts
- **Lucide React** — Icon set
- **Frankfurter API** — Free currency conversion (no key)
- **Open-Meteo API** — Free weather forecasts (no key)
- **Vanilla CSS** — Dark theme, glassmorphism, CSS custom properties

---

## 📁 Folder Structure

```
src/
├── components/
│   ├── common/        → Button, Modal, Loader, Navbar, ProtectedRoute
│   ├── dashboard/     → StatCard, BudgetBar, ExpensePieChart
│   ├── expense/       → ExpenseCard, ExpenseForm, ExpenseList
│   ├── trip/          → TripCard, TripForm
│   └── weather/       → WeatherWidget
├── context/           → AuthContext, TripContext
├── hooks/             → useTrip, useExpenses, useCurrency, useWeather
├── pages/             → Auth, Dashboard, Trips, TripDetail, AddExpense, NotFound
├── services/          → firebase.js, currencyApi.js, weatherApi.js
├── styles/            → index.css (design system)
├── utils/             → formatCurrency, categoryIcons, weatherCodes, constants
├── App.jsx            → Root layout (sidebar + outlet)
├── main.jsx           → Entry point
└── router.jsx         → Route definitions
```

---

## 🚀 Setup Instructions

### 1. Clone & Install

```bash
cd "End-Term Project"
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. **Create a project** (or use existing)
3. **Add a Web App** → copy the config
4. **Enable Authentication**:
   - Go to Authentication → Sign-in method
   - Enable **Email/Password**
   - Enable **Google** (optional but recommended)
5. **Create Firestore Database**:
   - Go to Firestore Database → Create database
   - Start in **Test mode** (for development)

### 3. Configure Environment

```bash
cp .env.example .env
```

Fill in your Firebase config in `.env`:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 4. Run

```bash
npm run dev
```

Open `http://localhost:5173`

---

## 🎓 React Concepts Demonstrated

| Concept | Where Used |
|---------|------------|
| `useState` | All forms, modals, search/filter state |
| `useEffect` | Auth listener, Firestore subscriptions, API calls |
| `useContext` | `AuthContext` (user state), `TripContext` (trips data) |
| `useReducer` | `TripContext` — complex state management |
| `useMemo` | Expense totals, category aggregation, budget percentages |
| `useCallback` | CRUD functions in TripContext, useExpenses |
| `useRef` | Form autofocus in ExpenseForm |
| `React.lazy` + `Suspense` | Code-split page loading |
| Custom hooks | `useTrip`, `useExpenses`, `useCurrency`, `useWeather` |
| Context API | `AuthProvider`, `TripProvider` |
| Controlled forms | All form components |
| Conditional rendering | Auth guards, loading, empty states, budget alerts |
| List rendering + keys | Trip list, expense list, weather days, filter chips |
| Props & composition | Entire component hierarchy |
| Error boundaries | Route-level error handling |

---

## 🔌 APIs Used

| API | Purpose | Key Required? |
|-----|---------|---------------|
| [Frankfurter](https://frankfurter.dev) | Currency exchange rates (ECB data) | ❌ No |
| [Open-Meteo](https://open-meteo.com) | 7-day weather forecast | ❌ No |
| [Firebase Auth](https://firebase.google.com/docs/auth) | User authentication | ✅ Firebase config |
| [Cloud Firestore](https://firebase.google.com/docs/firestore) | Database | ✅ Firebase config |

---

## 📝 License

This project is for educational purposes as part of the React course end-term submission.
