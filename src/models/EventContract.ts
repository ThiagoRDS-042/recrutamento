import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from "typeorm";
import { Contract } from "./Contract";

// Definições da entidade, junto de seu nome e especificações das colunas
@Entity("t_contrato_evento")
export class EventContract {
  @PrimaryColumn()
  id: string;

  @CreateDateColumn()
  data_criacao: Date;

  @CreateDateColumn()
  data_atualizacao: Date;

  @Column()
  contrato_id: string;

  @OneToOne(() => Contract)
  @JoinColumn({ name: "contrato_id" })
  contrato: Contract;

  @Column()
  estado_anterior: string;

  @Column()
  estado_posterior: string;
}
