# Meeting Room Reservation System

A full-stack web application for managing meeting room reservations built with React and Node.js.

## Features

- User Authentication (Admin/Staff roles)
- Room Management
- Booking System with Calendar View
- Admin Dashboard
- Staff Dashboard

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

### Frontend
- React.js
- Material-UI
- Axios for API calls
- React Router for navigation

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/Hasintha00/MEETING-ROOM--RESAVATION-SYSTEM.git
cd MEETING-ROOM--RESAVATION-SYSTEM
```

2. Install Backend Dependencies
```bash
cd backend
npm install
```

3. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

4. Set up Environment Variables
Create a `.env` file in the backend directory:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

5. Seed the Database (Optional)
```bash
cd backend
node seed.js
```

This creates default users:
- Admin: admin@example.com / password123
- Staff: staff@example.com / password123

### Running the Application

1. Start the Backend Server
```bash
cd backend
npm start
```
Server runs on http://localhost:5000

2. Start the Frontend Application
```bash
cd frontend
npm start
```
Application runs on http://localhost:3000

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - User login
- GET `/api/auth` - Get current user

### Rooms
- GET `/api/rooms` - Get all rooms
- POST `/api/rooms` - Create new room (Admin only)
- PUT `/api/rooms/:id` - Update room (Admin only)
- DELETE `/api/rooms/:id` - Delete room (Admin only)

### Bookings
- GET `/api/bookings` - Get all bookings
- POST `/api/bookings` - Create new booking
- PUT `/api/bookings/:id` - Update booking
- DELETE `/api/bookings/:id` - Delete booking

## Project Structure

```
meeting-room--resavation-system/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── index.js
│   └── seed.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── services/
│   └── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
