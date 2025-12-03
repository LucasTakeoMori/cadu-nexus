import { PrismaCustomersRepository } from "@/repositories/prisma/prisma-customers-repository";
import { RegisterCustomerCase } from "../register-customer";

export function makeRegisterCustomerUseCase() {
	const customerRepository = new PrismaCustomersRepository();
	const registerCustomerUseCase = new RegisterCustomerCase(customerRepository);

	return registerCustomerUseCase;
}
