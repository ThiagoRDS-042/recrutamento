import { EntityRepository, Repository } from "typeorm";

import { Contract } from "../models/Contract";

// Criando o repositório de contrato extendendo a classe Repository do typeorm e atribuindo o tipo de model
@EntityRepository(Contract)
export class ContractRepository extends Repository<Contract> {}
