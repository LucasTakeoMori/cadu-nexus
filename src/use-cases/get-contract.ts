import type { Contract } from "@prisma/client";
import type { ContractsRepository } from "@/repositories/contracts-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface GetContractUseCaseRequest {
	contractId: string;
}

interface GetContractUseCaseResponse {
	contract: Contract;
}

export class GetContractUseCase {
	constructor(private contractsRepository: ContractsRepository) {}

	async execute({
		contractId,
	}: GetContractUseCaseRequest): Promise<GetContractUseCaseResponse> {
		const contract = await this.contractsRepository.findById(contractId);

		if (!contract) {
			throw new ResourceNotFoundError();
		}

		return {
			contract,
		};
	}
}
