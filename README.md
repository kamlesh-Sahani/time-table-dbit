# College Timetable Management System

A dynamic and responsive web application for managing college timetables, developed using **Next.js**, **MongoDB**, **Tailwind CSS**, **Axios**, **JWT**, and **bcrypt.js**. The system allows students, faculty, and administrators to view, manage, and update timetables efficiently.
![Screenshot from 2025-01-10 23-50-06](https://github.com/user-attachments/assets/84816cb0-5072-4b00-8dca-fbde596ae3ba)

---

## Features

### 1. Authentication and Authorization
- **Secure Login and Signup**: User passwords are securely hashed using **bcrypt.js**.
- **Role-Based Access**:
  - Students: View personalized timetables.
  - Faculty: View and manage their assigned classes.
  - Admin: Full control over timetable management.
- **JWT**: Ensures secure user sessions and API access.

### 2. Timetable Management
- **Dynamic Updates**: Admins can add, update, or delete timetable entries in real-time.
- **Personalized Timetables**: Students and faculty can view timetables specific to their roles.
- **Search and Filter**: Quickly find classes, subjects, or faculty schedules.

### 3. User Notifications
- Email or in-app notifications for timetable changes.

### 4. Responsive Design
- A clean, modern UI built with **Tailwind CSS**, optimized for desktop and mobile devices.

### 5. API Integration
- **Axios** is used for seamless client-server communication.

---

## Tech Stack

### Frontend
- **Next.js**: For server-side rendering and optimized performance.
- **Tailwind CSS**: For modern, responsive, and customizable designs.

### Backend
- **Node.js** with **Next.js API Routes**: For handling server-side logic.
- **MongoDB**: As the NoSQL database for storing timetable and user data.

### Authentication & Security
- **JWT**: For secure user authentication.
- **bcrypt.js**: For hashing user passwords.

### API Communication
- **Axios**: For efficient HTTP requests.

---

## Installation

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (Local or cloud instance, e.g., MongoDB Atlas)

### Steps

1. Clone the repository:
   ```bash
   git clone h[ttps://github.com/your-username/college-timetable.git](https://github.com/kamlesh-Sahani/time-table-dbit.git)
   cd time-table-dbit.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
   ```env
   MONGODB_URI=<your-mongodb-connection-string>
   JWT_SECRET=<your-jwt-secret>
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open the app in your browser:
   ```
   http://localhost:3000
   ```

---


## Usage

### For Admins
1. Login with admin credentials.
2. Navigate to the "Manage Timetable" section.
3. Add, update, or delete timetable entries.

### For Students/Faculty
1. Login with your credentials.
2. View your personalized timetable on the dashboard.
3. Receive updates for any changes made by the admin.

---

## Screenshots

### Login Page
![Login Page](path/to/login-screenshot.png)

### Timetable Dashboard
![Dashboard](path/to/dashboard-screenshot.png)

---

## Future Enhancements
- Integration with third-party calendar apps (e.g., Google Calendar).
- Offline access to timetables.
- Export timetables as PDF or Excel files.
- Dark mode support.

---

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add some feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature
   ```
5. Submit a pull request.

---

## License
This project is licensed under the [MIT License](LICENSE).

