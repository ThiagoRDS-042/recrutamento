<h1 align="center">recrutamento</h1>

<p align="center">
  <img alt="License" src="https://img.shields.io/static/v1?label=license&message=MIT&color=8257E5&labelColor=000000">

 <img src="https://img.shields.io/static/v1?label=NLW&message=05&color=8257E5&labelColor=000000" alt="NLW 05" />
</p>

<br>

## ✨ Tecnologias

Esse projeto foi desenvolvido com as seguintes tecnologias:

- [Node.js](https://nodejs.org/en/)
- [Typescript](https://www.typescriptlang.org/)
- [Express](https://expressjs.com/pt-br/)
- [TypeORM](https://typeorm.io/#/)

## 🚀 Como executar

- Em caso de sistema operacional linux mude o script `"typeorm": "set DB_NAME=recrutamento&& ts-node-dev node_modules/typeorm/cli.js"` para `"typeorm": "DB_NAME=recrutamento ts-node-dev node_modules/typeorm/cli.js"` no arquivo `package.json` linha 9.
- Abra o terminal e digite `yarn dev` para criar o banco de dados e iniciar a aplicação.
- Abra outro terminal e digite `yarn typeorm migration:run` para criar as tabelas no banco de dados.

Por fim, a aplicação estará disponível em `http://localhost:2222`
