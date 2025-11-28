import type { Customer, Prisma } from "@prisma/client";

export interface CustomersRepository {
	findByEmail(email: string): Promise<Customer | null>;
	create(data: Prisma.CustomerCreateInput): Promise<Customer>;
}
