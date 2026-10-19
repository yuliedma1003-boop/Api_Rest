const resources = [
  { path: "clientes", name: "Cliente" },
  { path: "mascotas", name: "Mascota" },
  { path: "veterinarios", name: "Veterinario" },
  { path: "citas", name: "Cita" },
  { path: "historias-clinicas", name: "HistoriaClinica" }
];

const schemas = {
  ClienteInput: {
    type: "object",
    additionalProperties: false,
    required: ["nombre", "identificacion", "telefono", "correo"],
    properties: {
      nombre: { type: "string", minLength: 2, maxLength: 120 },
      identificacion: { type: "string", minLength: 5, maxLength: 30 },
      telefono: { type: "string", minLength: 7, maxLength: 30 },
      correo: { type: "string", format: "email", maxLength: 150 },
      direccion: { type: "string", maxLength: 200, nullable: true }
    }
  },
  MascotaInput: {
    type: "object",
    additionalProperties: false,
    required: ["nombre", "especie", "sexo", "clienteId"],
    properties: {
      nombre: { type: "string", minLength: 1, maxLength: 100 },
      especie: { type: "string", minLength: 2, maxLength: 60 },
      raza: { type: "string", maxLength: 100, nullable: true },
      fechaNacimiento: { type: "string", format: "date", nullable: true },
      sexo: { type: "string", enum: ["MACHO", "HEMBRA", "NO_ESPECIFICADO"] },
      clienteId: { type: "integer", minimum: 1 }
    }
  },
  VeterinarioInput: {
    type: "object",
    additionalProperties: false,
    required: ["nombre", "registroProfesional", "especialidad", "telefono", "correo"],
    properties: {
      nombre: { type: "string", minLength: 2, maxLength: 120 },
      registroProfesional: { type: "string", minLength: 3, maxLength: 40 },
      especialidad: { type: "string", minLength: 2, maxLength: 100 },
      telefono: { type: "string", minLength: 7, maxLength: 30 },
      correo: { type: "string", format: "email", maxLength: 150 }
    }
  },
  CitaInput: {
    type: "object",
    additionalProperties: false,
    required: ["fechaHora", "motivo", "mascotaId", "veterinarioId"],
    properties: {
      fechaHora: { type: "string", format: "date-time" },
      motivo: { type: "string", minLength: 3, maxLength: 500 },
      estado: { type: "string", enum: ["PROGRAMADA", "CONFIRMADA", "ATENDIDA", "CANCELADA"] },
      mascotaId: { type: "integer", minimum: 1 },
      veterinarioId: { type: "integer", minimum: 1 }
    }
  },
  HistoriaClinicaInput: {
    type: "object",
    additionalProperties: false,
    required: ["fecha", "diagnostico", "tratamiento", "mascotaId", "veterinarioId"],
    properties: {
      fecha: { type: "string", format: "date" },
      diagnostico: { type: "string", minLength: 3 },
      tratamiento: { type: "string", minLength: 3 },
      observaciones: { type: "string", nullable: true },
      mascotaId: { type: "integer", minimum: 1 },
      veterinarioId: { type: "integer", minimum: 1 },
      citaId: { type: "integer", minimum: 1, nullable: true }
    }
  },
  ErrorDetail: {
    type: "object",
    required: ["campo", "mensaje"],
    properties: { campo: { type: "string" }, mensaje: { type: "string" } }
  },
  ErrorResponse: {
    type: "object",
    required: ["status", "mensaje", "data", "error", "code"],
    properties: {
      status: { type: "string", enum: ["error"] },
      mensaje: { type: "string" },
      data: { type: "object", nullable: true },
      error: {
        oneOf: [
          { type: "string" },
          { type: "array", items: { $ref: "#/components/schemas/ErrorDetail" } }
        ]
      },
      code: { type: "integer" }
    }
  }
};

for (const { name } of resources) {
  schemas[`${name}Record`] = {
    allOf: [
      { $ref: `#/components/schemas/${name}Input` },
      {
        type: "object",
        required: ["id", "createdAt", "updatedAt"],
        properties: {
          id: { type: "integer" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        }
      }
    ]
  };
}

const successResponse = (description, dataSchema) => ({
  description,
  content: {
    "application/json": {
      schema: {
        type: "object",
        required: ["status", "mensaje", "data", "error", "code"],
        properties: {
          status: { type: "string", enum: ["success"] },
          mensaje: { type: "string" },
          data: dataSchema,
          error: { type: "string", nullable: true },
          code: { type: "integer" }
        }
      }
    }
  }
});

const errorResponse = (description) => ({
  description,
  content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } }
});

const paths = {
  "/": {
    get: {
      tags: ["Sistema"],
      summary: "Verificar que la API está activa",
      responses: { 200: successResponse("API activa", { type: "string", nullable: true }) }
    }
  },
  "/health": {
    get: {
      tags: ["Sistema"],
      summary: "Verificar API y conexión con la base de datos",
      responses: {
        200: successResponse("API y base de datos disponibles", {
          type: "object",
          properties: {
            api: { type: "string", example: "connected" },
            database: { type: "string", example: "connected" }
          }
        }),
        500: errorResponse("La base de datos no está disponible")
      }
    }
  }
};

for (const { path, name } of resources) {
  const record = { $ref: `#/components/schemas/${name}Record` };
  const input = { $ref: `#/components/schemas/${name}Input` };
  const collectionPath = `/api/v1/${path}`;
  const itemPath = `${collectionPath}/{id}`;

  paths[collectionPath] = {
    get: {
      tags: [name],
      summary: `Listar ${path}`,
      responses: {
        200: successResponse("Lista consultada correctamente", { type: "array", items: record }),
        500: errorResponse("Error interno del servidor")
      }
    },
    post: {
      tags: [name],
      summary: `Crear ${path}`,
      requestBody: { required: true, content: { "application/json": { schema: input } } },
      responses: {
        201: successResponse("Registro creado", record),
        400: errorResponse("Datos inválidos o referencias inexistentes"),
        409: errorResponse("Registro duplicado"),
        500: errorResponse("Error interno del servidor")
      }
    }
  };

  paths[itemPath] = {
    get: {
      tags: [name],
      summary: `Consultar ${path} por id`,
      parameters: [{ $ref: "#/components/parameters/id" }],
      responses: {
        200: successResponse("Registro consultado", record),
        400: errorResponse("Id inválido"),
        404: errorResponse("Registro no encontrado"),
        500: errorResponse("Error interno del servidor")
      }
    },
    put: {
      tags: [name],
      summary: `Actualizar ${path}`,
      parameters: [{ $ref: "#/components/parameters/id" }],
      requestBody: { required: true, content: { "application/json": { schema: input } } },
      responses: {
        200: successResponse("Registro actualizado", record),
        400: errorResponse("Datos inválidos"),
        404: errorResponse("Registro no encontrado"),
        409: errorResponse("Conflicto con una relación existente"),
        500: errorResponse("Error interno del servidor")
      }
    },
    delete: {
      tags: [name],
      summary: `Eliminar ${path}`,
      parameters: [{ $ref: "#/components/parameters/id" }],
      responses: {
        200: successResponse("Registro eliminado", { type: "string", nullable: true }),
        400: errorResponse("Id inválido"),
        404: errorResponse("Registro no encontrado"),
        409: errorResponse("El registro tiene relaciones existentes"),
        500: errorResponse("Error interno del servidor")
      }
    }
  };
}

export const openapi = {
  openapi: "3.0.3",
  info: {
    title: "DataPet API",
    version: "1.0.0",
    description: "API REST veterinaria para clientes, mascotas, veterinarios, citas e historias clínicas. Las respuestas usan status, mensaje, data, error y code."
  },
  servers: [{ url: "http://localhost:3000" }],
  tags: [{ name: "Sistema" }, ...resources.map(({ name }) => ({ name }))],
  paths,
  components: {
    parameters: {
      id: { name: "id", in: "path", required: true, schema: { type: "integer", minimum: 1 } }
    },
    schemas
  }
};