# DataPet API

API REST para apoyar la gestión de una veterinaria. Está organizada por capas y expone operaciones CRUD para clientes, mascotas, veterinarios, citas e historias clínicas.

## Requisitos

- Node.js LTS y npm
- PostgreSQL para la configuración de entrega; SQLite está disponible para pruebas locales sin instalar un servidor de base de datos.

## Instalación y ejecución

1. Copia `.env.example` como `.env` y configura el usuario y la contraseña de PostgreSQL, o usa `DB_DIALECT=sqlite` para pruebas locales.
2. Instala dependencias y ejecuta el servidor:

```bash
npm install
npm run dev
```

Con `DB_SYNC=true`, Sequelize crea las tablas al iniciar en desarrollo. Para PostgreSQL manual, crea `datapet_db`, ejecuta `database.sql` y configura `DB_SYNC=false`. SQLite guarda su archivo en `DB_STORAGE`. No publiques el archivo `.env`.

El servidor estará disponible en `http://localhost:3000`, la comprobación de API/BD en `http://localhost:3000/health` y la documentación interactiva en `http://localhost:3000/api-docs`.

## Estructura

```text
src/
  config/       Conexión a PostgreSQL
  controllers/  Coordinación HTTP y respuestas
  docs/         Especificación OpenAPI
  middlewares/  Validación y manejo de errores
  models/       Modelos Sequelize y relaciones
  routes/       Endpoints versionados
  schemas/      Esquemas Zod
  services/     Operaciones de persistencia
  utils/        Errores y respuestas comunes
  app.js        Configuración Express
  server.js     Conexión e inicio del servidor
```

## Recursos

Todos los recursos implementan `GET /`, `GET /:id`, `POST /`, `PUT /:id` y `DELETE /:id` bajo `/api/v1`.

| Recurso | Endpoint | Relaciones |
| --- | --- | --- |
| Clientes | `/api/v1/clientes` | Un cliente puede tener varias mascotas |
| Mascotas | `/api/v1/mascotas` | Cada mascota pertenece a un cliente |
| Veterinarios | `/api/v1/veterinarios` | Atienden citas e historias clínicas |
| Citas | `/api/v1/citas` | Relaciona una mascota con un veterinario |
| Historias clínicas | `/api/v1/historias-clinicas` | Registra atención, diagnóstico y tratamiento |

Ejemplo para crear una mascota (el cliente debe existir):

```json
{
  "nombre": "Luna",
  "especie": "Perro",
  "raza": "Labrador",
  "fechaNacimiento": "2022-05-10",
  "sexo": "HEMBRA",
  "clienteId": 1
}
```

Los valores admitidos para `sexo` son `MACHO`, `HEMBRA` y `NO_ESPECIFICADO`. Las citas admiten los estados `PROGRAMADA`, `CONFIRMADA`, `ATENDIDA` y `CANCELADA`.

## Respuestas

Todas las respuestas mantienen la estructura `status`, `mensaje`, `data`, `error` y `code`. Las validaciones responden `400`, los registros inexistentes `404`, duplicados `409` y los errores inesperados `500`.

## Variables de entorno

`PORT`, `FRONTEND_ORIGIN`, `DB_DIALECT`, `DB_STORAGE`, `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` y `DB_SYNC`. CORS permite el origen configurado en `FRONTEND_ORIGIN`.

## Pruebas y colección

Ejecuta `npm test` para las pruebas de contrato, validación y el CRUD HTTP completo de los cinco recursos; localmente usan SQLite y no necesitan PostgreSQL. Con el servidor activo, ejecuta `npm run test:postman` para correr el flujo con Newman. En Postman, ejecuta la carpeta `Flujo CRUD completo` de `DataPet.postman_collection.json`.

La captura de Swagger con los endpoints documentados está en [evidencia-swagger.png](evidencia-swagger.png).
El detalle de las capturas y pruebas reproducibles está en [EVIDENCIAS.md](EVIDENCIAS.md).

## Arquitectura

Las rutas conectan los endpoints con validaciones y controladores. Los controladores forman la respuesta HTTP; los servicios ejecutan operaciones sobre modelos Sequelize; los modelos definen las tablas y relaciones PostgreSQL.