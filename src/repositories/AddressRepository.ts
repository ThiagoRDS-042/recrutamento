import { EntityRepository, Repository } from "typeorm";

import { Address } from "../models/Address";

// Criando o repositório de endereço extendendo a classe Repository do typeorm e atribuindo o tipo de model
@EntityRepository(Address)
export class AddressesRepository extends Repository<Address> {}
