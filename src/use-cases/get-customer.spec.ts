import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryCustomersRepository } from "@/repositories/in-memory/in-memory-customers-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { GetCustomerUseCase } from "./get-customer";

let customersRepository: InMemoryCustomersRepository;
let sut: GetCustomerUseCase;

describe("Get User Profile Use Case", () => {
	beforeEach(() => {
		customersRepository = new InMemoryCustomersRepository();
		sut = new GetCustomerUseCase(customersRepository);
	});

	it("should be able to get user profile", async () => {
		const createdCustomer = await customersRepository.create({
			name: "John Doe",
			email: "john.doe@example.com",
			address: "123 Fake Street, Springfield",
			phone: "+1 555-123-4567",
		});

		const { customer } = await sut.execute({
			customerId: createdCustomer.id,
		});

		expect(customer.id).toEqual(expect.any(String));
		expect(customer.name).toEqual("John Doe");
	});

	it("should not be able to get user profile with wrong id", async () => {
		await expect(() =>
			sut.execute({
				customerId: "non-existing-user-id",
			}),
		).rejects.toBeInstanceOf(ResourceNotFoundError);
	});
});
