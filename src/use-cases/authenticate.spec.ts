import { hash } from "bcryptjs";
import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { AuthenticateUseCase } from "./authenticate";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;

describe("Authenticate Use Case", () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository();
		sut = new AuthenticateUseCase(usersRepository);
	});

	it("should be able to authenticate", async () => {
		await usersRepository.create({
			name: "John Doe",
			email: "john.doe@example.com",
			password: await hash("123456", 6),
		});

		const { user } = await sut.execute({
			email: "john.doe@example.com",
			password: "123456",
		});

		expect(user.id).toEqual(expect.any(String));
	});

	it("should not be able to authenticate with wrong email", async () => {
		const usersRepository = new InMemoryUsersRepository();
		const sut = new AuthenticateUseCase(usersRepository);

		expect(() =>
			sut.execute({
				email: "john.doe@example.com",
				password: "123456",
			}),
		).rejects.toBeInstanceOf(InvalidCredentialsError);
	});

	it("should not be able to authenticate with wrong password", async () => {
		const usersRepository = new InMemoryUsersRepository();
		const sut = new AuthenticateUseCase(usersRepository);

		await usersRepository.create({
			name: "John Doe",
			email: "john.doe@example.com",
			password: await hash("123456", 6),
		});

		expect(() =>
			sut.execute({
				email: "john.doe@example.com",
				password: "123123",
			}),
		).rejects.toBeInstanceOf(InvalidCredentialsError);
	});
});
