import { after, test } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import app from "../src/app.js";
import { sequelize } from "../src/config/database.js";
import { Cliente, Mascota, Veterinario, Cita, HistoriaClinica } from "../src/models/index.js";

test("CRUD HTTP completo para los cinco recursos veterinarios", async () => {
  await sequelize.sync();

  const unique = Date.now();
  const created = {};
  const resources = [
    {
      key: "cliente",
      path: "/api/v1/clientes",
      payload: {
        nombre: "Cliente de integración",
        identificacion: `TEST-${unique}`,
        telefono: "3001234567",
        correo: `datapet-${unique}@example.com`,
        direccion: "Bogotá"
      },
      update: { nombre: "Cliente actualizado" }
    },
    {
      key: "veterinario",
      path: "/api/v1/veterinarios",
      payload: {
        nombre: "Veterinaria de integración",
        registroProfesional: `MV-${unique}`,
        especialidad: "Medicina general",
        telefono: "3101234567",
        correo: `vet-${unique}@example.com`
      },
      update: { nombre: "Veterinaria actualizada" }
    }
  ];

  try {
    for (const resource of resources) {
      const response = await request(app)
        .post(resource.path)
        .send(resource.payload);

      assert.equal(response.status, 201, `${resource.key}: crear`);
      created[resource.key] = { ...resource, id: response.body.data.id };
    }

    const mascota = {
      key: "mascota",
      path: "/api/v1/mascotas",
      payload: {
        nombre: "Mascota de integración",
        especie: "Perro",
        raza: "Criollo",
        fechaNacimiento: "2022-05-10",
        sexo: "HEMBRA",
        clienteId: created.cliente.id
      },
      update: { nombre: "Mascota actualizada" }
    };
    let response = await request(app).post(mascota.path).send(mascota.payload);
    assert.equal(response.status, 201, "mascota: crear");
    created.mascota = { ...mascota, id: response.body.data.id };

    const cita = {
      key: "cita",
      path: "/api/v1/citas",
      payload: {
        fechaHora: "2026-11-01T14:00:00.000Z",
        motivo: "Control general",
        estado: "PROGRAMADA",
        mascotaId: created.mascota.id,
        veterinarioId: created.veterinario.id
      },
      update: { estado: "CONFIRMADA" }
    };
    response = await request(app).post(cita.path).send(cita.payload);
    assert.equal(response.status, 201, "cita: crear");
    created.cita = { ...cita, id: response.body.data.id };

    const historia = {
      key: "historia clínica",
      path: "/api/v1/historias-clinicas",
      payload: {
        fecha: "2026-11-01",
        diagnostico: "Buen estado general",
        tratamiento: "Control preventivo",
        observaciones: "Sin novedades",
        mascotaId: created.mascota.id,
        veterinarioId: created.veterinario.id,
        citaId: created.cita.id
      },
      update: { observaciones: "Seguimiento anual" }
    };
    response = await request(app).post(historia.path).send(historia.payload);
    assert.equal(response.status, 201, "historia clínica: crear");
    created.historia = { ...historia, id: response.body.data.id };

    for (const resource of Object.values(created)) {
      const listed = await request(app).get(resource.path);
      assert.equal(listed.status, 200, `${resource.key}: listar`);
      assert.ok(listed.body.data.some((record) => record.id === resource.id), `${resource.key}: aparece en listado`);

      const read = await request(app).get(`${resource.path}/${resource.id}`);
      assert.equal(read.status, 200, `${resource.key}: consultar`);

      const updated = await request(app)
        .put(`${resource.path}/${resource.id}`)
        .send({ ...resource.payload, ...resource.update });
      assert.equal(updated.status, 200, `${resource.key}: actualizar`);
      assert.equal(updated.body.data.id, resource.id);
    }

    for (const resource of [created.historia, created.cita, created.mascota, created.veterinario, created.cliente]) {
      const deleted = await request(app).delete(`${resource.path}/${resource.id}`);
      assert.equal(deleted.status, 200, `${resource.key}: eliminar`);
    }
  } finally {
    if (created.historia) await HistoriaClinica.destroy({ where: { id: created.historia.id } });
    if (created.cita) await Cita.destroy({ where: { id: created.cita.id } });
    if (created.mascota) await Mascota.destroy({ where: { id: created.mascota.id } });
    if (created.veterinario) await Veterinario.destroy({ where: { id: created.veterinario.id } });
    if (created.cliente) await Cliente.destroy({ where: { id: created.cliente.id } });
  }
});

test("GET /health confirma la conexión con la base de datos", async () => {
  const response = await request(app).get("/health");

  assert.equal(response.status, 200);
  assert.equal(response.body.data.api, "connected");
  assert.equal(response.body.data.database, "connected");
});

test("duplicados responden 409 con el contrato uniforme", async () => {
  await sequelize.sync();
  const unique = Date.now();
  const payload = {
    nombre: "Cliente duplicado",
    identificacion: `DUP-${unique}`,
    telefono: "3001234567",
    correo: `dup-${unique}@example.com`
  };

  try {
    const first = await request(app).post("/api/v1/clientes").send(payload);
    assert.equal(first.status, 201);

    const duplicate = await request(app).post("/api/v1/clientes").send(payload);
    assert.equal(duplicate.status, 409);
    assert.equal(duplicate.body.status, "error");
    assert.equal(duplicate.body.error, "DUPLICATE_RESOURCE");
    assert.equal(duplicate.body.code, 409);
  } finally {
    await Cliente.destroy({ where: { identificacion: payload.identificacion } });
  }
});

test("referencias inválidas, ids incorrectos y recursos inexistentes tienen errores HTTP claros", async () => {
  await sequelize.sync();
  const invalidReference = await request(app)
    .post("/api/v1/mascotas")
    .send({
      nombre: "Sin cliente",
      especie: "Gato",
      sexo: "NO_ESPECIFICADO",
      clienteId: 2147483647
    });
  assert.equal(invalidReference.status, 409);
  assert.equal(invalidReference.body.error, "RESOURCE_CONFLICT");

  const invalidId = await request(app).get("/api/v1/clientes/no-es-un-id");
  assert.equal(invalidId.status, 400);
  assert.equal(invalidId.body.error, "INVALID_ID");

  const missing = await request(app).get("/api/v1/clientes/2147483647");
  assert.equal(missing.status, 404);
  assert.equal(missing.body.error, "RESOURCE_NOT_FOUND");
});

test("CORS permite el origen configurado y omite otros orígenes", async () => {
  const allowed = await request(app)
    .get("/")
    .set("Origin", "http://localhost:5173");
  assert.equal(allowed.headers["access-control-allow-origin"], "http://localhost:5173");

  const blocked = await request(app)
    .get("/")
    .set("Origin", "https://unautorizado.example");
  assert.notEqual(blocked.headers["access-control-allow-origin"], "https://unautorizado.example");
});

after(async () => {
  await sequelize.close();
});