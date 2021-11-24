import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";

import { Address } from "./Address";
import { Client } from "./Client";

// Definições da entidade, junto de seu nome e especificações das colunas
@Entity("t_ponto")
export class Ponto {
  @PrimaryColumn()
  id: string;

  @CreateDateColumn()
  data_criacao: Date;

  @CreateDateColumn()
  data_atualizacao: Date;

  @Column()
  cliente_id: string;

  @ManyToOne(() => Client)
  @JoinColumn({ name: "cliente_id" })
  cliente: Client;

  @Column()
  endereco_id: string;

  @ManyToOne(() => Address)
  @JoinColumn({ name: "endereco_id" })
  endereco: Address;

  @CreateDateColumn()
  data_remocao: Date;
}
