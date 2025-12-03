import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repositoy";
import { RegisterUserUseCase } from "../register-user";

export function makeRegisterUserUseCase() {
	const userRepository = new PrismaUsersRepository();
	const registerUseCase = new RegisterUserUseCase(userRepository);

	return registerUseCase;
}
