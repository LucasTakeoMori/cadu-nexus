import type { User } from "@prisma/client";
import bcrypt from "bcrypt";
import type { UsersRepository } from "@/repositories/users-repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";

interface RegisterUserUseCaseRequest {
	name: string;
	email: string;
	password: string;
}

interface RegisterUseCaseResponse {
	user: User;
}

export class RegisterUserUseCase {
	constructor(private usersRepository: UsersRepository) {}

	async execute({
		name,
		email,
		password,
	}: RegisterUserUseCaseRequest): Promise<RegisterUseCaseResponse> {
		const hashedPassword = await bcrypt.hash(password, 6);

		const userWithSameEmail = await this.usersRepository.findByEmail(email);

		if (userWithSameEmail) {
			throw new UserAlreadyExistsError();
		}

		const user = await this.usersRepository.create({
			name,
			email,
			password: hashedPassword,
		});

		return {
			user,
		};
	}
}
