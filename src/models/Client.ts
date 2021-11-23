import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

// Definições da entidade, junto de seu nome e especificações das colunas
@Entity("t_cliente")
export class Client {
  @PrimaryColumn()
  id: string;

  @CreateDateColumn()
  data_criacao: Date;

  @CreateDateColumn()
  data_atualizacao: Date;

  @Column()
  nome: string;

  @CreateDateColumn()
  data_remocao: Date;

  @Column()
  tipo: string;
}
