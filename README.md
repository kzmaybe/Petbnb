# PetBnB 🐾

A full-stack booking platform that connects pet owners with trusted sitters. The project mimics an Airbnb-style experience
with secure authentication, polished dashboards for both owners and hosts, and a modern React frontend powered by a Node.js
/ Express API and PostgreSQL database.

## Features

- 🔐 **Authentication & Authorization** – JWT-based login/signup with role-aware routes for sitters and owners.
- 🏠 **Listings Management** – Sitters can create, edit, and delete pet stay listings directly from their dashboard.
- 📅 **Booking Flow** – Owners browse available listings, submit booking requests, and track approval statuses.
- 👥 **Role Specific Dashboards** – Tailored dashboards for sitters (host tools + booking approvals) and owners (trip
  management).
- ☁️ **Container-ready Deployment** – Docker configuration for the API and PostgreSQL database with a single
  `docker-compose` command.
- 🎨 **Modern UI** – Responsive React app styled with Tailwind CSS, featuring interactive modals and feedback states.

## Tech Stack

- **Frontend:** React 18, Vite, React Router, Tailwind CSS, Axios
- **Backend:** Node.js, Express 5, Sequelize ORM
- **Database:** PostgreSQL
- **Auth:** JSON Web Tokens (JWT)
- **Containerization:** Docker & Docker Compose

## Project Structure

```
.
├── backend/               # Express API, Sequelize models & controllers
├── frontend/              # React application (Vite + Tailwind)
├── docker-compose.yml     # Container orchestration for API + PostgreSQL
├── .env.example           # Sample backend environment variables
└── frontend/.env.example  # Sample frontend environment variables
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- PostgreSQL 14+ (if running locally without Docker)

### Backend Setup

1. Install dependencies (already checked into the repository for convenience, but you can reinstall):

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and adjust the values for your environment.
3. Ensure PostgreSQL is running and the configured database exists.
4. Run the API:

   ```bash
   npm start
   ```

   The server listens on `http://localhost:5001` and exposes the REST API at `/api`.

### Frontend Setup

1. Navigate into the frontend workspace and install dependencies:

   ```bash
   cd frontend
   npm install
   ```

2. Copy `frontend/.env.example` to `frontend/.env` and point `VITE_API_URL` to your API (defaults to
   `http://localhost:5001/api`).
3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open the app at the URL shown in the terminal (typically `http://localhost:5173`).

### Docker Compose

Spin up PostgreSQL and the API with Docker:

```bash
docker-compose up --build
```

This command launches the database (with persistent volume storage) and the Express API. The API becomes available at
`http://localhost:5001/api`.

### Seed Suggestions

Log into the application and create accounts for both roles:

- **Owner account** – Explore the listing catalogue and send booking requests.
- **Sitter account** – Publish listings, update pricing, and approve or reject incoming requests.

## API Overview

| Method | Endpoint                   | Description                         |
| ------ | -------------------------- | ----------------------------------- |
| POST   | `/api/auth/signup`         | Create a new owner or sitter        |
| POST   | `/api/auth/login`          | Authenticate and receive a JWT      |
| GET    | `/api/auth/me`             | Fetch the authenticated user        |
| GET    | `/api/listings`            | Retrieve all published listings     |
| POST   | `/api/listings`            | Create a listing (sitter only)      |
| GET    | `/api/listings/me`         | Get listings for the current sitter |
| PUT    | `/api/listings/:id`        | Update an existing listing          |
| DELETE | `/api/listings/:id`        | Remove a listing                    |
| POST   | `/api/bookings`            | Request a booking (owner only)      |
| GET    | `/api/bookings/owner`      | Owner booking history               |
| GET    | `/api/bookings/sitter`     | Booking requests for a sitter       |
| PUT    | `/api/bookings/:id`        | Approve or reject a booking         |

All protected routes require the `Authorization: Bearer <token>` header.

## Development Notes

- Sequelize models live in `backend/models` and automatically establish associations between Users, Listings, and
  Bookings.
- Tailwind is configured inside `frontend/tailwind.config.js`; utility classes power most of the UI components.
- The React app relies on context (`AuthContext`) to manage authentication state and to guard routes based on role.

Feel free to fork the project and extend it with features like messaging, availability calendars, or Stripe payments.
Contributions are welcome!
