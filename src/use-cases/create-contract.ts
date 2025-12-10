import type { ContractStatus } from "@prisma/client";
import type { ContractsRepository } from "@/repositories/contracts-repository";
import type { CustomersRepository } from "@/repositories/customers-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface createContractUseCaseRequest {
	customer_id: string;
	file_path: string;
	file_name: string;
	start_date: string;
	end_date: string;
	status: ContractStatus;
}

export class CreateContractUseCase {
	constructor(
		private contractsRepository: ContractsRepository,
		private customersRepository: CustomersRepository,
	) {}

	async execute({
		customer_id,
		file_path,
		file_name,
		start_date,
		end_date,
		status,
	}: createContractUseCaseRequest) {
		// checking if customer exists
		const customer = await this.customersRepository.findById(customer_id);

		if (!customer) {
			throw new ResourceNotFoundError();
		}

		const contract = await this.contractsRepository.create({
			customer: {
				connect: { id: customer_id },
			},
			file_path,
			file_name,
			start_date,
			end_date,
			status,
		});

		return {
			contract,
		};
	}
}
