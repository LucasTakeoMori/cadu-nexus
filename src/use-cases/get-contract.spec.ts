import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryContractsRepository } from "@/repositories/in-memory/in-memory-contracts-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { GetContractUseCase } from "./get-contract";

let contractsRepository: InMemoryContractsRepository;
let sut: GetContractUseCase;

describe("Get Contract Use Case", () => {
	beforeEach(() => {
		contractsRepository = new InMemoryContractsRepository();
		sut = new GetContractUseCase(contractsRepository);
	});

	it("should be able to get a contract", async () => {
		const createdContract = await contractsRepository.create({
			customer: { connect: { id: "customer-1" } },
			file_path: "/contracts/contract-1.pdf",
			file_name: "contract-1.pdf",
			start_date: "2024-01-01",
			end_date: "2024-12-31",
			status: "ACTIVE",
		});

		const { contract } = await sut.execute({
			contractId: createdContract.id,
		});

		expect(contract.id).toEqual(expect.any(String));
		expect(contract.file_name).toEqual("contract-1.pdf");
	});

	it("should not be able to get a non-existent contract", async () => {
		await expect(() =>
			sut.execute({
				contractId: "non-existent-contract-id",
			}),
		).rejects.toBeInstanceOf(ResourceNotFoundError);
	});
});
