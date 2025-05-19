
# 📬 Notification Service – Full Stack Project(INTERN ASSIGNMENT)

This is a **modular, scalable notification service** that sends Email, SMS, and WhatsApp messages using Kafka, Twilio, Nodemailer, PostgreSQL, and Node.js. It also includes a React + Vite frontend for interacting with the system.

---

## 📁 Project Structure

```
Notification-Service/
├── backend/
│   ├── index.js                    # Express server
│   ├── .env                        # Environment variables
│   ├── kafka/
│   │   ├── producer.js             # Kafka producer
│   │   ├── consumer.js             # Kafka consumer
│   │   └── kafkaClient.js          # Kafka setup
│   ├── Send_Notification/
│   │   ├── Email.js                # Email service
│   │   ├── SMS.js                  # Twilio SMS
│   │   └── WhatsApp.js             # Twilio WhatsApp
│   └── DB_Config/
│       ├── db.js                   # PostgreSQL connection
│       ├── schema.sql              # Table schema
│       └── seed_data.sql           # Sample seed
└── frontend/                       # React frontend (optional part)
```

---

## 🚀 Features

- 🔁 Kafka-based event-driven notification processing
- 📧 Nodemailer-based HTML email
- 📱 SMS & WhatsApp via Twilio
- 🗃 PostgreSQL for persistent notification logging
- 🧪 Testable API endpoints for enqueueing and viewing notifications

---

## 🛠 Setup Instructions

### 1. Clone and Navigate
```bash
git clone https://github.com/Aniket-Maity-22053660/Intern-Assignment-Notification-Service
cd notification-service/backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure `.env`
Create a `.env` file in the backend root:

```dotenv
PORT=5000
EMAIL=your.email@gmail.com
EMAIL_PASS=your_app_password
ACCOUNT_SID=your_twilio_sid
AUTH_TOKEN=your_twilio_token

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=notification_db
```

### 4. Setup Database
Run the schema and seed scripts in PostgreSQL:

```sql
-- schema.sql
CREATE TABLE IF NOT EXISTS public.notifications (
  id SERIAL PRIMARY KEY,
  user_name VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  notification_type VARCHAR(50) NOT NULL,
  action VARCHAR(50),
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- seed_data.sql (optional)
INSERT INTO public.notifications (user_name, message, notification_type, action)
VALUES ('test_user', 'Welcome!', 'Email', 'signup');
```

### 5. Run Kafka Locally
Use Docker or your preferred Kafka setup, and update the broker IP in `kafkaClient.js`.

### 6. Start Backend
```bash
node index.js
```

---

## 🧠 Detailed Technical Design

### ✅ `.env`
Stores credentials securely. Loaded using `dotenv`.

### ✅ `index.js`
Handles routing for:
- `POST /notifications`: Enqueues to Kafka
- `GET /users/:username/notifications`: Fetches user history

### ✅ Kafka Integration
- `producer.js`: Sends messages
- `consumer.js`: Listens, dispatches notifications, logs to DB

### ✅ Notification Dispatch
- `Email.js`: Gmail via `nodemailer`
- `SMS.js` & `WhatsApp.js`: Powered by Twilio

### ✅ Database
PostgreSQL table `notifications` with `user_name`, `message`, `type`, `action`, `sent_at`

---

## 📡 API Summary

### POST `/notifications`
```json
{
  "userName": "john_doe",
  "message": "Hello from the backend!",
  "notificationType": "Email",
  "action": "login"
}
```

### GET `/users/:username/notifications`
Returns past notifications sorted by timestamp.

---

## 🔐 Security

- Environment secrets (`.env`) not hardcoded.
- SQL injection prevention via parameterized queries.
- CORS protected to allow only trusted frontend domains.

---

## 🌱 Scalability & Extensibility

- Kafka supports async, distributed event processing.
- Handlers are modular — plug in Slack, Telegram, etc.

---

## 🧪 Future Improvements

- 🔁 Retry logic for failed Kafka deliveries
- 🐳 Docker Compose for full environment
- 📊 Dashboard frontend (React + Tailwind)

---
-----------------------------------------------------------------------------------------------------------------------------

# 🖥️ Notification Frontend – Vite + React Application

This is the **React-based frontend** for the Kafka-powered Notification Service. It allows users to:
- Submit notifications of various types (SMS, WhatsApp, Email, In-App)
- View historical notifications by user from the backend

Built with **Vite** for lightning-fast performance, and styled with custom responsive CSS.

---

## 📁 Project Structure

```
frontend/
├── index.html               # HTML template for Vite
├── vite.config.js           # Vite dev/build config
├── .gitignore               # Ignore rules
├── eslint.config.js         # ESLint ruleset
├── src/
│   ├── App.jsx              # App entry component
│   ├── main.jsx             # ReactDOM render
│   ├── App.css              # Global layout styles
│   ├── index.css            # Body, background, fonts
│   └── component/
│       ├── Main_Page.jsx    # Form & Notification viewer
│       └── Main_Page.css    # Component styling
```

---

## 🚀 Key Features

- 📋 Form to enter user name, message, and notification type
- 🔘 Radio buttons for channel selection (SMS, WhatsApp, Email, In-App)
- 📩 Submit notifications to Kafka via backend API
- 🧾 Retrieve past notifications for any user
- 🧬 Fully responsive & styled with modern effects

---

## 📦 Tech Stack

| Tool         | Purpose                      |
|--------------|------------------------------|
| Vite         | Frontend bundler & dev server|
| React        | UI framework                 |
| Axios        | API communication            |
| Custom CSS   | Styling forms & components   |

---

## 🧠 Component Breakdown

### ✅ `Main_Page.jsx`
This is the **main logic file**.

- `useState` to track userName, message, notificationType
- `handleSubmit()` sends a POST request to `/notifications`
- Button click triggers a GET request to `/users/:username/notifications`
- Dynamically renders results or form based on `seeNotifications` flag

### ✅ `Main_Page.css`
- Glassmorphism design (blur + transparency)
- Responsive layout and typography
- Styled radio buttons, input fields, submit buttons

### ✅ `App.jsx`
- Imports `Main_Page` component and renders it
- Originally contained a `count` state that’s no longer used

### ✅ `index.html`
- Contains the root `<div id="root">`
- Loads `main.jsx` as module

### ✅ `main.jsx`
- ReactDOM.render using `createRoot`
- Imports base CSS + mounts `<App />`

---

## 🌐 API Communication

Uses **Axios** to hit Express server routes:

### 🔼 POST `/notifications`
Sends the notification payload.

```json
{
  "userName": "john_doe",
  "message": "Test message",
  "notificationType": "Email",
  "action": "Send"
}
```

### 🔽 GET `/users/:username/notifications`
Fetches notification history for display.

---

## 🧪 Testing

- Open `http://localhost:5173`
- Fill in form → Submit → View Notifications
- Test CORS & API handling with backend running on port 5000

---

## 🧰 Development Notes

- Environment: Dev server runs on `http://localhost:5173`
- Backend server must run on `http://localhost:5000`
- CORS configured for frontend origin

---
-------------------------------------------------------------------------------------------------------------------------------------------
## 🖼️ UI Preview

### Notification Form

![Notification Form - Step 1](Screen_Shots/Screenshot_2025-05-19_024103-1.png)
![Notification Form - Step 2](Screen_Shots/Screenshot_2025-05-19_024132.png)


-------------------------------------------------------------------------------------------------------------------------------------------

## ✅ Conclusion

This React frontend makes notification management intuitive, responsive, and fast. Its simplicity, component modularity, and clean design make it ideal for both interviews and real-world integration.