import type { Customer } from "@prisma/client";
import type { CustomersRepository } from "@/repositories/customers-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface GetCustomerUseCaseRequest {
	customerId: string;
}

interface GetCustomerUseCaseResponse {
	customer: Customer;
}

export class GetCustomerUseCase {
	constructor(private customersRepository: CustomersRepository) {}

	async execute({
		customerId,
	}: GetCustomerUseCaseRequest): Promise<GetCustomerUseCaseResponse> {
		const customer = await this.customersRepository.findById(customerId);

		if (!customer) {
			throw new ResourceNotFoundError();
		}

		return {
			customer,
		};
	}
}
