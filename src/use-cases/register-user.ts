import bcrypt from "bcrypt";
import type { UsersRepository } from "@/repositories/users-repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";

interface registerUserUseCaseRequest {
	name: string;
	email: string;
	password: string;
}

export class RegisterUserUseCase {
	constructor(private usersRepository: UsersRepository) {}

	async execute({ name, email, password }: registerUserUseCaseRequest) {
		const hashedPassword = await bcrypt.hash(password, 6);

		const userWithSameEmail = await this.usersRepository.findByEmail(email);

		if (userWithSameEmail) {
			throw new UserAlreadyExistsError();
		}

		await this.usersRepository.create({
			name,
			email,
			password: hashedPassword,
		});
	}
}
