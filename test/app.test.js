import { test } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import app from "../src/app.js";

test("GET / responde con el contrato uniforme de éxito", async () => {
  const response = await request(app).get("/");

  assert.equal(response.status, 200);
  assert.deepEqual(Object.keys(response.body), ["status", "mensaje", "data", "error", "code"]);
  assert.equal(response.body.status, "success");
  assert.equal(response.body.code, 200);
  assert.equal(response.body.data, null);
});

test("POST /api/v1/mascotas rechaza datos incompletos antes de consultar la BD", async () => {
  const response = await request(app)
    .post("/api/v1/mascotas")
    .send({ nombre: "", clienteId: -1 });

  assert.equal(response.status, 400);
  assert.equal(response.body.status, "error");
  assert.equal(response.body.code, 400);
  assert.ok(Array.isArray(response.body.error));
});

test("rutas desconocidas responden 404 con el contrato uniforme", async () => {
  const response = await request(app).get("/ruta-inexistente");

  assert.equal(response.status, 404);
  assert.equal(response.body.status, "error");
  assert.equal(response.body.data, null);
  assert.equal(response.body.code, 404);
});