Este sistema de gestión de tareas (To-Do List) fue desarrollado utilizando FastAPI como backend y proporciona autenticación basada en JWT (JSON Web Token) para cada usuario.

Se puede probar ejecutando el servidor local con FastAPI, previa activación del entorno virtual e instalación de sus dependencias especificadas en "requirements.txt".

Una vez iniciado el servidor, se puede acceder a la interfaz de usuario navegando al archivo index.html, donde los usuarios podrán registrarse, iniciar sesión y gestionar sus tareas personales.

Cada usuario tiene acceso únicamente a sus propias tareas, las cuales pueden ser creadas, visualizadas y eliminadas. Todas las tareas requieren un título, descripción y fecha programada.

El sistema utiliza JWT para la autenticación y almacenamiento seguro de sesiones. Además, las contraseñas de los usuarios se almacenan de forma encriptada, garantizando mayor seguridad en la aplicación.