import { MigrationInterface, QueryRunner } from "typeorm";

export class ConfigsDB1637675377802 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await await queryRunner.query(`
    CREATE ROLE playground;
    ALTER ROLE playground WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS ENCRYPTED PASSWORD 'dev123456';
        
    CREATE EXTENSION IF NOT EXISTS unaccent WITH SCHEMA public;
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        
    CREATE FUNCTION public.tf_utils_setar_data_atualizacao() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    DECLARE 
        tabela_raw TEXT; 
        tabela TEXT; 
        temp_mensagem TEXT;
    BEGIN
        IF (TG_OP = 'UPDATE') THEN
            NEW.data_atualizacao = now();
            RETURN NEW;
        ELSE 
          
            tabela_raw := replace(TG_TABLE_NAME, 't_', '');
            tabela := replace(tabela_raw, '_', ' ');
            temp_mensagem := 'Atributo data_atualizacao, atualização NãO autorizada para gatilhos diferentes de UPDATE para ('||tabela||') !!'; 
            RAISE EXCEPTION feature_not_supported USING HINT = temp_mensagem;
        
        END IF;
    END;
        
    $$;
        
    ALTER FUNCTION public.tf_utils_setar_data_atualizacao() OWNER TO postgres;
        
    GRANT EXECUTE ON FUNCTION public.tf_utils_setar_data_atualizacao() to playground;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    DROP FUNCTION public.tf_utils_setar_data_atualizacao();

    DROP ROLE playground;

    DROP EXTENSION unaccent;

    DROP EXTENSION "uuid-ossp";
    `);
  }
}
