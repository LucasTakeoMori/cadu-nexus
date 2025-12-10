import { compare } from "bcryptjs";
import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";
import { RegisterUserUseCase } from "./register-user";

let usersRepository: InMemoryUsersRepository;
let sut: RegisterUserUseCase;

describe("Register User Use Case", () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository();
		sut = new RegisterUserUseCase(usersRepository);
	});

	it("it should be possible to register a user", async () => {
		const { user } = await sut.execute({
			name: "John Doe",
			email: "john.doe@example.com",
			password: "123456",
		});

		expect(user.id).toEqual(expect.any(String));
	});

	it("should hash user password upon registration", async () => {
		const { user } = await sut.execute({
			name: "John Doe",
			email: "john.doe@example.com",
			password: "123456",
		});

		const isPasswordCorrectlyHashed = await compare("123456", user.password);

		expect(isPasswordCorrectlyHashed).toBe(true);
	});

	it("should not be able to register with same email twice", async () => {
		const email = "john.doe@example.com";

		await sut.execute({
			name: "John Doe",
			email,
			password: "123456",
		});

		await expect(() =>
			sut.execute({
				name: "John Doe",
				email,
				password: "123456",
			}),
		).rejects.toBeInstanceOf(UserAlreadyExistsError);
	});
});
