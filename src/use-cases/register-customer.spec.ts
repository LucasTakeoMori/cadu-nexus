import { describe, expect, it } from "vitest";
import { InMemoryCustomersRepository } from "@/repositories/in-memory/in-memory-customers-repository";
import { RegisterCustomerCase } from "./register-customer";
import { CustomerAlreadyExistsError } from "./errors/customer-already-exists-error";

describe("Register Use Case", () => {
    it("it should be possible to register a customer", async () => {
        const customersRepository = new InMemoryCustomersRepository();
        const registerUseCase = new RegisterCustomerCase(customersRepository);

        await registerUseCase.execute({
            name: "Cadu Marketing Test",
            email: "cadu.marketing@example.com",
            address: "123 Main St",
            phone: "1190928391",
        });
    });

    it("should not be able to register with same email twice", async () => {
        const customersRepository = new InMemoryCustomersRepository();
        const registerUseCase = new RegisterCustomerCase(customersRepository);

        const email = "cadu.marketing@example.com";

        await registerUseCase.execute({
            name: "Cadu Marketing Test",
            email,
            address: "123 Main St",
            phone: "1190928391",
        });

        await expect(() =>
            registerUseCase.execute({
                name: "Cadu Marketing Test",
                email,
                address: "123 Main St",
                phone: "1190928391",
            }),
        ).rejects.toBeInstanceOf(CustomerAlreadyExistsError);
    });
});
