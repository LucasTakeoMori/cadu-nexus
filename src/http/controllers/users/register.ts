import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repositoy";
import { UserAlreadyExistsError } from "@/use-cases/errors/user-already-exists-error";
import { RegisterUserUseCase } from "@/use-cases/register-user";

export async function createUser(request: FastifyRequest, reply: FastifyReply) {
	const userSchema = z.object({
		name: z.string(),
		email: z.string().trim().pipe(z.email()),
		password: z.string().min(6),
	});

	const { name, email, password } = userSchema.parse(request.body);

	try {
		const userRepository = new PrismaUsersRepository();
		const registerUseCase = new RegisterUserUseCase(userRepository);

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
