🏡 RentHub API

RentHub es una API con arquitectura de microservicios diseñada para probar y mostrar mis habilidades en el desarrollo de sistemas escalables y modernos utilizando microservicios. 🚀

🧑‍💻 Servicios

1️⃣ Gateway

El punto de entrada de toda la API, que se encarga de enrutar las solicitudes a los microservicios correspondientes y gestionar la comunicación entre ellos.

2️⃣ Auth-Service

Maneja toda la lógica de autenticación y autorización, incluyendo el registro de usuarios y la generación de tokens JWT para el acceso seguro a la plataforma.

3️⃣ User-Service

Gestiona todo lo relacionado con los usuarios, desde la creación y obtención de datos hasta las actualizaciones de perfil.

4️⃣ Property-Service

Este servicio se encarga de gestionar las propiedades que los usuarios pueden alquilar. Aquí se almacenan todos los detalles sobre las propiedades.

5️⃣ Reservation-Service

Responsable de gestionar las reservas de las propiedades. Asegura que las fechas y disponibilidades estén correctamente manejadas.

6️⃣Email-Service

 Responsable del envío de correos electrónicos a nuevos usuarios y al realizar reservas.

⚙️ Tecnologías Utilizadas

Node.js con NestJS para cada microservicio
gRPC para la comunicación eficiente entre microservicios
MongoDB y MySQL para el almacenamiento de datos
Redis para el almacenamiento en caché y la mejora del rendimiento
JWT para la autenticación segura
Documentación API con Swagger.

📜 Funcionalidades Clave

Autenticación Segura: Gestión de usuarios con JWT para proteger los endpoints.

Gestión de Propiedades: Añade, actualiza y elimina propiedades que los usuarios pueden reservar.

Reservas: Sistema de reservas que garantiza la disponibilidad y evita conflictos de fechas.

Microservicios Independientes: Los microservicios de usuarios, autenticación, propiedades y reservas están completamente desacoplados, lo que asegura flexibilidad y escalabilidad.


🚀 Cómo empezar

Prerrequisitos
Node.js y npm instalados.
MongoDB y MySQL configurados.
Redis instalado para el cacheo.

Clona el repositorio : 

Instala las dependencias: 
cd renthub
npm install

Configura las variables de entorno en .env.

Inicia todos los microservicios:
npm run start:dev

inicia Redis-server.exe

💬 Let's Connect!
Have questions or want to collaborate? Reach out to me on LinkedIn or shoot me an email at bryantperezgarcia005@gmail.com
