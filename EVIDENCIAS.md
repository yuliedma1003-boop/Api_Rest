# Evidencias DataPet

## Capturas

- `evidencia-servidor.png`: respuesta de la ruta raíz.
- `evidencia-base-datos.png`: `/health` confirma que la API y SQLite responden.
- `evidencia-error.png`: respuesta uniforme para un registro inexistente.
- `evidencia-swagger.png`: rutas y contratos OpenAPI publicados.
- `evidencia-postman.json`: ejecución Newman con solicitudes y aserciones aprobadas.

## Pruebas automatizadas

Ejecutar `npm test` para la suite Supertest, o `npm run test:postman` para correr el flujo Newman contra `http://localhost:3000`. La colección realiza 29 solicitudes, prueba el contrato HTTP y limpia los registros al final. La suite Supertest comprueba:

- CRUD HTTP de clientes, mascotas, veterinarios, citas e historias clínicas.
- Contrato uniforme para éxito, validación y rutas inexistentes.
- Conflicto `409` por duplicados y por referencias inválidas.
- IDs incorrectos, recurso no encontrado y CORS desde el origen permitido.
- Conexión a la base local mediante `GET /health`.

La carpeta `Flujo CRUD completo` de `DataPet.postman_collection.json` se puede ejecutar en Postman. `npm run test:postman` ejecuta esa misma carpeta con Newman y verifica status/contrato en cada respuesta.

## PostgreSQL

Este entorno no tiene PostgreSQL instalado ni escuchando en el puerto 5432. Por eso no se afirma que `database.sql` haya sido ejecutado contra PostgreSQL. Para esa evidencia, instala/inicia PostgreSQL, configura `.env` con `DB_DIALECT=postgres`, crea `datapet_db`, ejecuta `database.sql` y repite las pruebas.