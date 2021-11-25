<h1 align="center">recrutamento</h1>

<br>

## ✨ Tecnologias

Esse projeto foi desenvolvido com as seguintes tecnologias:

- [Node.js](https://nodejs.org/en/)
- [Typescript](https://www.typescriptlang.org/)
- [Express](https://expressjs.com/pt-br/)
- [TypeORM](https://typeorm.io/#/)

## 🚀 Como executar

- Abra o terminal e digite `yarn install` ou `yarn` para instalar todas as dependências do projeto.
- Em caso de sistema operacional linux mude o script `"typeorm": "set DB_NAME=recrutamento&& ts-node-dev node_modules/typeorm/cli.js"` para `"typeorm": "DB_NAME=recrutamento ts-node-dev node_modules/typeorm/cli.js"` no arquivo `package.json` linha 9.
- Altere a senha, porta e host do banco de dados de acordo com sua configuração.
- No mesmo terminal digite `yarn dev` para criar o banco de dados e iniciar a aplicação.

- Abra outro terminal e digite `yarn typeorm migration:run` para criar as tabelas no banco de dados.

Por fim, a aplicação estará disponível em `http://localhost:2222`

### Autor

---

Feito por ❤️ Thiago Rodrigues 👋🏽
