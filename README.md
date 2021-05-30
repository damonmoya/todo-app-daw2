# TodoAppDaw2

Trabajo 1 de Angular para la asignatura de Desarrollo de Aplicaciones Web II

## Despliegue de la aplicación

https://todo-app-daw2.web.app/

## ¿Cómo se ha hecho la aplicación?

Para su desarrollo, se ha utilizado Firebase para la implementación de la base de datos. Luego, en la base de datos de Firestore se encuentran dos colecciones: todos (tareas pendientes/en curso) y done_todos (tareas completadas). 

Con esta implementación, todo el listado de tareas es persistente incluso después de cerrar la aplicación. De igual forma, la aplicación actualiza los datos de ambas colecciones en tiempo real, sin necesidad de recargar la página.
