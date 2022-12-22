import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTypes1637676182317 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TYPE public.tipo_cliente AS ENUM (
            'juridico', 'fisico', 'especial'
        );
    
        ALTER TYPE public.tipo_cliente OWNER TO postgres;
    
        CREATE TYPE public.contrato_estado AS ENUM (
        'Em vigor', 'Desativado Temporario', 'Cancelado'
        );
    
        ALTER TYPE public.contrato_estado OWNER TO postgres;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TYPE public.contrato_estado;
      
      DROP TYPE public.tipo_cliente;
    `);
  }
}
