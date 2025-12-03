import type { CustomersRepository } from "@/repositories/customers-repository";
import { CustomerAlreadyExistsError } from "./errors/customer-already-exists-error";

interface registerCustomerUseCaseRequest {
    name: string;
    email: string;
    phone: string;
    address: string;
}

export class RegisterCustomerCase {
    constructor(private customersRepository: CustomersRepository) {}

    async execute({
        name,
        email,
        phone,
        address,
    }: registerCustomerUseCaseRequest) {
        const customerWithSameEmail =
            await this.customersRepository.findByEmail(email);

        if (customerWithSameEmail) {
            throw new CustomerAlreadyExistsError();
        }

        await this.customersRepository.create({
            name,
            email,
            phone,
            address,
        });
    }
}
