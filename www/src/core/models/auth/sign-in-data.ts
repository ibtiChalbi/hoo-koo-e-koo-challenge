import { LoginDTO } from "../../generated/LoginDto";

export interface SigninData {
  signature: string;
  address: string | undefined;
}

export namespace SigninData {
  export function mapToApiValue(data: SigninData): LoginDTO {
    return {
      signature: data.signature,
      address: data.address,
    };
  }
}
