import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableClient1637676367695 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    CREATE TABLE public.t_cliente (
        id UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
        data_criacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        data_atualizacao TIMESTAMP WITH TIME ZONE,
        nome TEXT NOT NULL CHECK(char_length(nome) BETWEEN 3 AND 128) UNIQUE,
        data_remocao TIMESTAMP WITHOUT TIME ZONE,
        tipo public.tipo_cliente NOT NULL
    );

    ALTER TYPE public.tipo_cliente OWNER TO postgres;

    GRANT SELECT, INSERT, UPDATE ON public.t_cliente TO playground;

    REVOKE ALL ON TABLE public.t_cliente FROM public;

    CREATE TRIGGER t_cliente_setar_data_atualizacao
    BEFORE UPDATE 
    ON public.t_cliente
    FOR EACH ROW
    EXECUTE PROCEDURE public.tf_utils_setar_data_atualizacao();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    DROP TABLE public.t_cliente;
    `);
  }
}
