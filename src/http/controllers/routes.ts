import type { FastifyInstance } from "fastify";
import { createCustomer } from "./customers/register";
import { createUser } from "./users/register";

export async function appRoutes(app: FastifyInstance) {
	app.post("/user", createUser);
	app.post("/customer", createCustomer);
}
