import { EntityRepository, Repository } from "typeorm";

import { EventContract } from "../models/EventContract";

// Criando o repositório de evento do contrato extendendo a classe Repository do typeorm e atribuindo o tipo de model
@EntityRepository(EventContract)
export class EventContractRepository extends Repository<EventContract> {}
