import type { Customer, Prisma } from "@prisma/client";
import type { CustomersRepository } from "../customers-repository";

export class InMemoryCustomersRepository implements CustomersRepository {
    public items: Customer[] = [];

    async findByEmail(email: string) {
        const customer = this.items.find((item) => item.email === email);

        if (!customer) {
            return null;
        }

        return customer;
    }

    async create(data: Prisma.CustomerCreateInput) {
        const customer = {
            id: "customer-1",
            name: data.name,
            email: data.email,
            phone: data.phone,
            address: data.address,
            active: true,
            created_at: new Date(),
        };

        this.items.push(customer);

        return customer;
    }
}
