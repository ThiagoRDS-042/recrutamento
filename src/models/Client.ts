import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

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
