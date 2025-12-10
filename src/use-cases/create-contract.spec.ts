import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryContractsRepository } from "@/repositories/in-memory/in-memory-contracts-repository";
import { InMemoryCustomersRepository } from "@/repositories/in-memory/in-memory-customers-repository";
import { CreateContractUseCase } from "./create-contract";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

let contractsRepository: InMemoryContractsRepository;
let customersRepository: InMemoryCustomersRepository;
let sut: CreateContractUseCase;

describe("Create Contract Use Case", () => {
	beforeEach(() => {
		contractsRepository = new InMemoryContractsRepository();
		customersRepository = new InMemoryCustomersRepository();
		sut = new CreateContractUseCase(contractsRepository, customersRepository);
	});

	it("should be able to create a contract", async () => {
		const createdCustomer = await customersRepository.create({
			id: "customer-1",
			name: "John Doe",
			email: "johndoe@example.com",
			address: "123 Main St",
			phone: "555-1234",
		});

		const { contract } = await sut.execute({
			customer_id: createdCustomer.id,
			file_path: "/contracts/contract-1.pdf",
			file_name: "contract-1.pdf",
			start_date: "2024-01-01",
			end_date: "2024-12-31",
			status: "ACTIVE",
		});

		expect(contract.id).toEqual(expect.any(String));
	});

	it("shoud not be able to create contract with non-existent customer", async () => {
		await expect(() =>
			sut.execute({
				customer_id: "non-existent-customer",
				file_path: "/contracts/contract-1.pdf",
				file_name: "contract-1.pdf",
				start_date: "2024-01-01",
				end_date: "2024-12-31",
				status: "ACTIVE",
			}),
		).rejects.toBeInstanceOf(ResourceNotFoundError);
	});
});
