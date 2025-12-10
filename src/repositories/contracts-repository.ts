import type { Contract, Prisma } from "@prisma/client";

export interface ContractsRepository {
	findById(id: string): Promise<Contract | null>;
	findByCustomerId(customerId: string): Promise<Contract[]>;
	create(data: Prisma.ContractCreateInput): Promise<Contract>;
}
