import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTablePonto1637759387472 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    CREATE TABLE public.t_ponto (
        id UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
        data_criacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        data_atualizacao TIMESTAMP WITH TIME ZONE,
        cliente_id UUID NOT NULL REFERENCES public.t_cliente (id), 
        endereco_id UUID NOT NULL REFERENCES public.t_endereco (id),
        data_remocao TIMESTAMP WITHOUT TIME ZONE
    );
        
    ALTER TABLE public.t_ponto OWNER TO postgres;
        
    GRANT SELECT, INSERT, UPDATE ON public.t_ponto TO playground;
        
    REVOKE ALL ON TABLE public.t_ponto FROM public;
        
    CREATE TRIGGER t_ponto_setar_data_atualizacao
        BEFORE UPDATE 
        ON public.t_ponto
        FOR EACH ROW
    EXECUTE PROCEDURE public.tf_utils_setar_data_atualizacao();
        
    ALTER TABLE public.t_ponto ADD CONSTRAINT t_ponto_client_ender_uq UNIQUE(cliente_id, endereco_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE public.t_ponto
    `);
  }
}
