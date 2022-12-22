import { Address } from "../Address";

// Classe DTO para a filtragem de dados do endereço
export class AddressDTO {
  public readonly logradouro: string;

  public readonly bairro: string;

  public readonly numero: number;

  // Intera o DTO com o logradouro, bairro e numero
  constructor(address: Address) {
    const { logradouro, bairro, numero } = address;

    Object.assign(this, { logradouro, bairro, numero });
  }

  // Retorna o DTO
  static convertAddressToDTO(address: Address): AddressDTO {
    return new AddressDTO(address);
  }
}
