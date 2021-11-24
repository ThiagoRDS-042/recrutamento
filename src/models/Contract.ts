import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from "typeorm";
import { Ponto } from "./Ponto";

// Definições da entidade, junto de seu nome e especificações das colunas
@Entity("t_contrato")
export class Contract {
  @PrimaryColumn()
  id: string;

  @CreateDateColumn()
  data_criacao: Date;

  @CreateDateColumn()
  data_atualizacao: Date;

  @Column()
  ponto_id: string;

  @OneToOne(() => Ponto)
  @JoinColumn({ name: "ponto_id" })
  ponto: Ponto;

  @Column()
  estado: string;

  @CreateDateColumn()
  data_remocao: Date;
}
