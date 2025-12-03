import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { CustomerAlreadyExistsError } from "@/use-cases/errors/customer-already-exists-error";
import { makeRegisterCustomerUseCase } from "@/use-cases/factories/make-register-customer-use-case";

export async function createCustomer(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const customerSchema = z.object({
		name: z.string(),
		email: z.string().trim().pipe(z.email()),
		phone: z.string(),
		address: z.string(),
	});

	const { name, email, phone, address } = customerSchema.parse(request.body);

	try {
		const registerCustomerUseCase = makeRegisterCustomerUseCase();
		await registerCustomerUseCase.execute({
			name,
			email,
			phone,
			address,
		});
	} catch (err) {
		if (err instanceof CustomerAlreadyExistsError) {
			return reply.status(409).send({ message: err.message });
		}

		return reply.status(500).send();
	}

	return reply.status(201).send();
}
