# Lead Management System

A full-stack Lead Management System built for GlobalEd, featuring a public enrollment form, a secure admin dashboard, Google Sheets synchronization, and automated email reminders via Google Apps Script.

## Features

### 1. Public Lead Form (Frontend)
- **Framework:** React.js
- **Fields:** Name, Email, Phone, Course, College, Year.
- **Validation:** Handles required fields and validates email format.
- **Duplicate Prevention:** Prevents multiple submissions from the same email.
- **UI:** Responsive design with a clean, professional look.

### 2. Admin Panel
- **Security:** JWT Authentication & BCrypt Password Hashing.
- **Dashboard:** View all leads in a tabular format.
- **Search & Filter:** Search by name/email and filter by course.
- **Status Management:** Toggle lead status between `new` and `contacted`.

### 3. Backend & Database
- **Runtime:** Node.js with Express.
- **Database:** PostgreSQL (Hosted on Supabase).
- **ORM:** Sequelize for secure, parameterized queries.
- **API:** RESTful endpoints for lead creation, retrieval, and status updates.

### 4. Google Integrations
- **Google Sheets:** Automatically appends new leads to a Google Sheet.
- **Two-way Sync:** Updates the Google Sheet when a lead's status changes in the Admin Panel.
- **Apps Script Automation:** Daily trigger checks for 'new' leads older than 24 hours and sends reminder emails.

## Tech Stack

- **Frontend:** React, React Router, CSS
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL (Supabase)
- **External APIs:** Google Sheets API v4
- **Automation:** Google Apps Script

## Installation & Setup

### Prerequisites
- Node.js (v14+)
- PostgreSQL Database (or Supabase URL)
- Google Cloud Service Account (for Sheets API)

### 1. Clone the Repository
```bash
git clone https://github.com/Chandan-pullanikatt/lead-management-system.git
cd lead-management-system
```

### 2. Backend Setup
```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env
# (Populate .env with your DB credentials and Google keys)
```

**Required `.env` Variables:**
```env
PORT=5000
DATABASE_URL=postgres://...
JWT_SECRET=your_jwt_secret
GOOGLE_SHEETS_ID=your_sheet_id
GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account_email
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
GOOGLE_APPLICATION_CREDENTIALS=./google-service.json (Optional)
ADMIN_EMAIL=admin@globaled.in
ADMIN_PASSWORD=your_admin_password
```

### 3. Frontend Setup
```bash
cd client
npm install
```

### 4. Run the Application
You need to run both backend and frontend servers.

**Backend:**
```bash
# In the root directory
npm start
```

**Frontend:**
```bash
# In the client directory
npm start
```

## Google Apps Script Setup
1. Open your connected Google Sheet.
2. Go to **Extensions > Apps Script**.
3. Copy the content of `scripts/reminder.gs` into the editor.
4. Set up a daily trigger for the `sendReminders` function.

## API Endpoints

- `POST /api/leads` - Submit a new lead.
- `GET /api/leads` - Get all leads (Admin only).
- `PUT /api/leads/:id/status` - Update lead status (Admin only).
- `POST /api/auth/login` - Admin login.

## License
MIT
