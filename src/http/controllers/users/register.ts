import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { UserAlreadyExistsError } from "@/use-cases/errors/user-already-exists-error";
import { makeRegisterUserUseCase } from "@/use-cases/factories/make-register-user-use-case";

export async function createUser(request: FastifyRequest, reply: FastifyReply) {
	const userSchema = z.object({
		name: z.string(),
		email: z.string().trim().pipe(z.email()),
		password: z.string().min(6),
	});

	const { name, email, password } = userSchema.parse(request.body);

	try {
		const registerUseCase = makeRegisterUserUseCase();

		await registerUseCase.execute({
			name,
			email,
			password,
		});
	} catch (err) {
		if (err instanceof UserAlreadyExistsError) {
			return reply.status(409).send({ message: err.message });
		}

		throw err;
	}

	return reply.status(201).send();
}
