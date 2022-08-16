import { SignupDTO } from "core/generated/SignupDto";

export interface SignupData {
  address: string;
}

export namespace SignupData {
  export function mapToApiValue(data: SignupData): SignupDTO {
    return {
      address: data.address,
    };
  }
}
