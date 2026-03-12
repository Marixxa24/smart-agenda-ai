🚀 Smart Agenda AI — MERN + Google Gemini
<img width="1332" height="831" alt="image" src="https://github.com/user-attachments/assets/57170496-a355-4b11-acf8-0276b21a4f03" />

Aplicación web para la gestión de tareas que utiliza IA para clasificar automáticamente el contenido ingresado por el usuario.

El usuario solo escribe la tarea y la aplicación analiza el texto mediante un modelo de lenguaje para determinar su categoría (por ejemplo: estudio, trabajo, salud o personal).
La tarea se procesa en el backend, se clasifica con IA y luego se almacena estructurada en la base de datos.

📋 Funcionalidad

Creación de tareas mediante una interfaz simple.

Análisis del texto ingresado usando IA.

Clasificación automática de tareas en categorías.

Persistencia de la información en base de datos.

Interfaz dinámica basada en una SPA.

🧠 Integración de IA

La clasificación de tareas se realiza utilizando Gemini 3 Flash Preview a través del SDK de Google Generative AI.

En el backend se implementó un servicio que:

Recibe el texto de la tarea.

Envía el contenido al modelo de IA.

Obtiene la categoría sugerida.

Devuelve una respuesta estructurada.

Guarda la tarea clasificada en la base de datos.

🛠️ Stack Tecnológico

Frontend

React

Tailwind CSS

Backend

Node.js

Express

Base de datos

MongoDB Atlas

Modelado con Mongoose

Integraciones

Axios

dotenv

🔐 Próxima funcionalidad

Actualmente se está trabajando en la implementación de inicio de sesión con Google mediante Google OAuth 2.0, lo que permitirá:

Autenticación segura de usuarios.

Asociación de tareas a cada cuenta.

Privacidad y gestión individual de la agenda.

⚙️ Configuración del entorno

Clonar el repositorio.

Crear el archivo /server/.env:

MONGO_URI=tu_string_de_conexion
GEMINI_API_KEY=tu_api_key

Instalar dependencias:

npm install

Ejecutar en desarrollo:

npm run dev
