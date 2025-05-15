🎯 My Final Project – Backend  
This is the backend of the tutoring platform, built with Node.js and Express. It handles form submissions, exports data to Excel, and can send notifications via email.

🚀 Features  
• API endpoint to receive form data  
• Saves submissions into Excel files  
• Sends email notifications (optional)  
• CORS-enabled for frontend communication  
• Organized folder structure for scalability

🛠️ Technologies Used  
• Node.js  
• Express.js  
• ExcelJS  
• Nodemailer  
• dotenv  
• CORS

📦 Project Setup  
# Install dependencies  
npm install

# Start the server  
npm start

# The server will run on http://localhost:3001 by default

🌐 API Endpoint  
POST `/save-excel` – Accepts form data in JSON format and writes it to an Excel file stored in `/data`

🧪 Test User (for full-stack testing)  
• Email: `admin@example.com`  
• Password: `password`

📂 Related Links  
Frontend repo: https://github.com/KevinJasin/My-Final-Project  
Backend repo: https://github.com/KevinJasin/My-Final-Project-backend  
Live app: https://starlit-praline-3748d4.netlify.app/
