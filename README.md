# AI Image Generator

A full-stack AI Image Generator web application where users can register, log in, and generate images using text prompts. The app uses JWT authentication, protected routes, and a responsive UI built with React and Tailwind CSS.

## Features
- User registration and login
- JWT-based authentication
- Protected routes
- AI image generation using prompts
- Image preview and download
- Toast notifications
- Responsive UI with Tailwind CSS

## Tech Stack
- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express.js
- Authentication: JWT
- Database: MongoDB

## Project Structure
src/
- pages (Login, Register, Dashboard, Profile)
- component (Navbar, PromptInput, Gallery, PrivateRoute, ToastNotifications)
- App.jsx
- main.jsx

## Authentication
After login, a JWT token is generated and stored in localStorage inside the user object. The token is sent in API requests using:
Authorization: Bearer <token>

## Environment Variables
Create a .env file:
VITE_BACKEND_URL=http://localhost:5000
JWT_SECRET=your_jwt_secret_key

## Run Project
git clone https://github.com/your-username/ai-image-generator.git
cd ai-image-generator
npm install
npm run dev

## Usage
1. Register a new account
2. Login
3. Go to Generate page
4. Enter prompt
5. Generate and download image

## Future Improvements
- Refresh tokens
- Better UI/UX
- Image history
- Deployment

## Author
Chithra Kundar

## License
MIT License
