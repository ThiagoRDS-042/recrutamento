import { EntityRepository, Repository } from "typeorm";

import { Ponto } from "../models/Ponto";

// Criando o repositório de ponto extendendo a classe Repository do typeorm e atribuindo o tipo de model
@EntityRepository(Ponto)
export class PontoRepository extends Repository<Ponto> {}
