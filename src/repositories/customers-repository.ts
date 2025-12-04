import type { Customer, Prisma } from "@prisma/client";

export interface CustomersRepository {
	findById(id: string): Promise<Customer | null>;
	findByEmail(email: string): Promise<Customer | null>;
	create(data: Prisma.CustomerCreateInput): Promise<Customer>;
}
