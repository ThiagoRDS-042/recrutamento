import { EntityRepository, Repository } from "typeorm";

import { Client } from "../models/Client";

// Criando o repositório de Cliente extendendo a classe Repository do typeorm e atribuindo o tipo de model
@EntityRepository(Client)
export class ClientRepository extends Repository<Client> {}
