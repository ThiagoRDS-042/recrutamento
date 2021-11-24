import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableContract1637764583150 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    CREATE TABLE public.t_contrato (
        id UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
        data_criacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        data_atualizacao TIMESTAMP WITH TIME ZONE,
        ponto_id UUID NOT NULL REFERENCES public.t_ponto (id) UNIQUE, 
        estado public.contrato_estado NOT NULL,
        data_remocao TIMESTAMP WITHOUT TIME ZONE
    );
        
    ALTER TABLE public.t_contrato OWNER TO postgres;
        
    GRANT SELECT, INSERT, UPDATE ON public.t_contrato TO playground;
        
    REVOKE ALL ON TABLE public.t_contrato FROM public;
        
    CREATE TRIGGER t_contrato_setar_data_atualizacao
        BEFORE UPDATE 
        ON public.t_contrato
        FOR EACH ROW
    EXECUTE PROCEDURE public.tf_utils_setar_data_atualizacao();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE public.t_contrato
    `);
  }
}
