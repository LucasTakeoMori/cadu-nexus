import { describe, it, expect } from "vitest";
import { RegisterUserUseCase } from "./register-user";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { compare } from "bcryptjs";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";

describe("Register Use Case", () => {
    it("it should be possible to register a user", async () => {
        const usersRepository = new InMemoryUsersRepository();
        const registerUseCase = new RegisterUserUseCase(usersRepository);

        const { user } = await registerUseCase.execute({
            name: "John Doe",
            email: "john.doe@example.com",
            password: "123456",
        });

        expect(user.id).toEqual(expect.any(String));
    });

    it("should hash user password upon registration", async () => {
        const usersRepository = new InMemoryUsersRepository();
        const registerUseCase = new RegisterUserUseCase(usersRepository);

        const { user } = await registerUseCase.execute({
            name: "John Doe",
            email: "john.doe@example.com",
            password: "123456",
        });

        const isPasswordCorrectlyHashed = await compare(
            "123456",
            user.password,
        );

        expect(isPasswordCorrectlyHashed).toBe(true);
    });

    it("should not be able to register with same email twice", async () => {
        const usersRepository = new InMemoryUsersRepository();
        const registerUseCase = new RegisterUserUseCase(usersRepository);

        const email = "john.doe@example.com";

        await registerUseCase.execute({
            name: "John Doe",
            email,
            password: "123456",
        });

        await expect(() =>
            registerUseCase.execute({
                name: "John Doe",
                email,
                password: "123456",
            }),
        ).rejects.toBeInstanceOf(UserAlreadyExistsError);
    });
});
