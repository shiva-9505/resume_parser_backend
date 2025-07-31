Resume Upload & Parsing Dashboard Backend

This backend powers a resume management system for admins and users with the ability to:
Upload resumes (PDF/DOCX)
Parse key information like name, email, phone, skills, etc.
Role-based authentication
OTP login for admins
MongoDB integration

Tech Stack

Node.js + Express
MongoDB + Mongoose
JWT for Authentication
Multer for Resume Upload
PDF-Parse / Docx Parser
Nodemailer for OTPs



Authentication Flow

Admin Login
- OTP-based login only (email is fixed in `.env`)
- OTP sent using Nodemailer
- JWT token generated after OTP verification

User Login
- Login using email and password
- Created by admin only


Resume Upload Flow
- User can upload only 1 resume
- Allowed formats: `.pdf`, `.docx`
- Resume is parsed and stored in MongoDB
- If a resume already exists, user must delete to upload new one


.env Variables
PORT=8000
MONGO_URI=your_mongo_connection
JWT_SECRET=your_jwt_secret
ADMIN_EMAIL=admin@example.com
EMAIL_USER=your_gmail
EMAIL_PASS=your_app_password


Run Locally

npm install
npm start


Future Features (Planned)

- Search/filter resumes by skill/email
- Stats on dashboard
- CI/CD Deployment
- Email notifications on resume upload


For Project Help
Developer
- Shiva
- MERN Stack Developer

