🏡 RentHub API

RentHub is an API with a microservices architecture designed to showcase my skills in building scalable and modern systems using microservices. 🚀

🧑‍💻 Services

1️⃣ Gateway
The main entry point of the API, responsible for routing requests to the appropriate microservices and managing communication between them.

2️⃣ Auth-Service
Handles authentication and authorization, including user registration and generating secure JWT tokens for platform access.

3️⃣ User-Service
Manages all user-related operations, including creation, data retrieval, and profile updates.

4️⃣ Property-Service
Handles the management of properties available for rent, storing all property-related details.

5️⃣ Reservation-Service
Responsible for managing property reservations, ensuring dates and availability are handled correctly.

6️⃣ Email-Service
Manages email notifications for new users and reservation confirmations.

⚙️ Technologies Used

Node.js with NestJS for each microservice
gRPC for efficient communication between microservices
MongoDB and MySQL for data storage
Redis for caching and performance improvements
JWT for secure authentication
API documentation with Swagger
📜 Key Features

Secure Authentication: User management with JWT to protect endpoints.
Property Management: Add, update, and delete properties available for booking.
Reservations: A reservation system that ensures availability and prevents date conflicts.
Independent Microservices: Fully decoupled services for users, authentication, properties, and reservations, ensuring flexibility and scalability.
🚀 Getting Started

Prerequisites:

Node.js and npm installed
MongoDB and MySQL configured
Redis installed for caching
Clone the repository:
git clone https://github.com/bryant2305/RENTHUB-MICROSERVICES-API.git

Install dependencies:
cd renthub  
npm install  
Set up environment variables in .env.

Start all microservices:

npm run start:dev  
Start Redis:
Run redis-server.exe.

💬 Let's Connect!
Have questions or want to collaborate? Feel free to reach out to me on LinkedIn or email me at bryantperezgarcia005@gmail.com.
