import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableAddress1637753635199 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    CREATE TABLE public.t_endereco (
        id UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
        data_criacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        data_atualizacao TIMESTAMP WITH TIME ZONE,
        logradouro TEXT NOT NULL CHECK(char_length(logradouro) BETWEEN 3 AND 128),
        bairro TEXT NOT NULL CHECK(char_length(bairro) BETWEEN 3 AND 128),
        numero SMALLINT NOT NULL,
        data_remocao TIMESTAMP WITHOUT TIME ZONE
    );
    
    ALTER TABLE public.t_endereco OWNER TO postgres;
    
    GRANT SELECT, INSERT, UPDATE ON public.t_endereco TO playground;
    
    REVOKE ALL ON TABLE public.t_endereco FROM public;
    
    CREATE TRIGGER t_endereco_setar_data_atualizacao
      BEFORE UPDATE 
      ON public.t_endereco
      FOR EACH ROW
    EXECUTE PROCEDURE public.tf_utils_setar_data_atualizacao();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    DROP TABLE public.t_endereco
    `);
  }
}
