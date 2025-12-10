import type { Contract, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { ContractsRepository } from "../contracts-repository";

export class PrismaContractRepository implements ContractsRepository {
	async findById(id: string): Promise<Contract | null> {
		const contract = await prisma.contract.findUnique({
			where: {
				id,
			},
		});

		return contract;
	}

	async findByCustomerId(customerId: string): Promise<Contract[]> {
		const contracts = await prisma.contract.findMany({
			where: {
				customer_id: customerId,
			},
		});

		return contracts;
	}

	async create(data: Prisma.ContractCreateInput): Promise<Contract> {
		const contract = await prisma.contract.create({
			data,
		});

		return contract;
	}
}
