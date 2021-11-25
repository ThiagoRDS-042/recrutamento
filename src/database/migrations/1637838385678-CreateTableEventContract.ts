import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableEventContract1637838385678
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    CREATE TABLE public.t_contrato_evento (
        id UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
        data_criacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        data_atualizacao TIMESTAMP WITH TIME ZONE,
        contrato_id UUID NOT NULL REFERENCES public.t_contrato(id), 
        estado_anterior public.contrato_estado NOT NULL,
        estado_posterior public.contrato_estado NOT NULL
    );
    
    ALTER TABLE public.t_contrato_evento OWNER TO postgres;
    
    GRANT SELECT, INSERT, UPDATE ON public.t_contrato_evento TO playground;
    
    REVOKE ALL ON TABLE public.t_contrato_evento FROM public;
    
    CREATE TRIGGER t_contrato_evento_setar_data_atualizacao
      BEFORE UPDATE 
      ON public.t_contrato_evento
      FOR EACH ROW
    EXECUTE PROCEDURE public.tf_utils_setar_data_atualizacao();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    DROP TABLE public.t_contrato_evento;
    `);
  }
}
