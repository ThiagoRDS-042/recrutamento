import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

// Definições da entidade, junto de seu nome e especificações das colunas
@Entity("t_endereco")
export class Address {
  @PrimaryColumn()
  id: string;

  @CreateDateColumn()
  data_criacao: Date;

  @CreateDateColumn()
  data_atualizacao: Date;

  @Column()
  logradouro: string;

  @Column()
  bairro: string;

  @Column()
  numero: number;

  @CreateDateColumn()
  data_remocao: Date;
}
