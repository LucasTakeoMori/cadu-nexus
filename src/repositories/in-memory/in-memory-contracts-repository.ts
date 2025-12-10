import type { Contract, ContractStatus, Prisma } from "@prisma/client";
import type { ContractsRepository } from "../contracts-repository";

export class InMemoryContractsRepository implements ContractsRepository {
	public items: Contract[] = [];

	async findById(id: string) {
		const contract = this.items.find((item) => item.id === id);

		if (!contract) {
			return null;
		}

		return contract;
	}

	async findByCustomerId(customerId: string) {
		const contracts = this.items.filter(
			(item) => item.customer_id === customerId,
		);

		if (contracts.length === 0) {
			return [];
		}

		return contracts;
	}

	async create(data: Prisma.ContractCreateInput) {
		const contract = {
			id: "contract-1",
			customer_id: data.customer.connect?.id,
			file_path: data.file_path,
			file_name: data.file_name,
			start_date: data.start_date,
			end_date: data.end_date,
			status: data.status as ContractStatus,
			created_at: new Date(),
			updated_at: new Date(),
		};

		this.items.push(contract as Contract);

		return contract as Contract;
	}
}
