// Classe para o tratamento de erros e exceções
class AppError {
  // Atributos para somente leitura, so permite a atribuição a partir do construtor
  public readonly message: string;
  public readonly statusCode: number;

  // Repassa os valores de message e statusCode
  constructor(message: string, statusCode: number) {
    this.message = message;
    this.statusCode = statusCode;
  }
}

export { AppError };
