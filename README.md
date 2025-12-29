 🎨 AI Image Generator

A full-stack *AI Image Generator* web application that allows users to register, log in, and generate images using text prompts. The application uses *JWT authentication*, protected routes, and a modern, responsive UI.

---

## 🧑‍💻 Project Description

This project demonstrates a complete authentication-based web application where users can securely access AI-powered image generation features. After logging in, users can enter text prompts and generate images, preview them, and download the results.

This project highlights skills in *frontend development, backend integration, authentication, and API handling*.

---

## 🚀 Features

- User registration and login  
- JWT-based authentication  
- Protected routes (only logged-in users can access features)  
- AI image generation using text prompts  
- Image preview and download option  
- Toast notifications for success and errors  
- Responsive UI with dark mode support  

---

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS

### Backend
- Node.js
- Express.js

### Authentication
- JSON Web Tokens (JWT)

### Database
- MongoDB

---

## 📁 Project Structure

src/ │ ├── pages/ │   ├── Login.jsx │   ├── Register.jsx │   ├── Dashboard.jsx │   └── Profile.jsx │ ├── component/ │   ├── Navbar.jsx │   ├── PromptInput.jsx │   ├── Gallery.jsx │   ├── PrivateRoute.jsx │   └── ToastNotifications.jsx │ ├── App.jsx └── main.jsx

---

## 🔐 Authentication Flow

1. User registers or logs in  
2. Backend generates a JWT token  
3. Token is stored in localStorage  
4. Token is sent with API requests using:

Authorization: Bearer <token>

5. Protected routes are accessible only for authenticated users

---

## ▶️ How to Run the Project

1. Clone the repository:
git clone https://github.com/chithrakundarconnect-sys/Ai-image-generator.git

2. Install dependencies:

npm install

3. Start the development server:

npm run dev

🖼️ Usage

1. Register a new account
2. Login with your credentials
3. Navigate to the Generate page
4. Enter a text prompt
5. Generate and download the image

📌 Future Improvements

Add refresh token support

Store image generation history per user

Improve UI/UX animations

Deploy backend and frontend


📬 Contact

Chithra Kundar
📧 Email: chithrakundar.connect@gmail.com
💼 LinkedIn: https://www.linkedin.com/in/chithra-kundar-b6a6922a8/
🐙 GitHub: https://github.com/chithrakundarconnect-sys

📄 License
This project is licensed under the MIT License.
