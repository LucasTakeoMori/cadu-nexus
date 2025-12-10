import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryCustomersRepository } from "@/repositories/in-memory/in-memory-customers-repository";
import { CustomerAlreadyExistsError } from "./errors/customer-already-exists-error";
import { RegisterCustomerCase } from "./register-customer";

let customersRepository: InMemoryCustomersRepository;
let sut: RegisterCustomerCase;

describe("Register Customer Use Case", () => {
	beforeEach(() => {
		customersRepository = new InMemoryCustomersRepository();
		sut = new RegisterCustomerCase(customersRepository);
	});

	it("it should be possible to register a customer", async () => {
		await sut.execute({
			name: "Cadu Marketing Test",
			email: "cadu.marketing@example.com",
			address: "123 Main St",
			phone: "1190928391",
		});
	});

	it("should not be able to register with same email twice", async () => {
		const email = "cadu.marketing@example.com";

		await sut.execute({
			name: "Cadu Marketing Test",
			email,
			address: "123 Main St",
			phone: "1190928391",
		});

		await expect(() =>
			sut.execute({
				name: "Cadu Marketing Test",
				email,
				address: "123 Main St",
				phone: "1190928391",
			}),
		).rejects.toBeInstanceOf(CustomerAlreadyExistsError);
	});
});
