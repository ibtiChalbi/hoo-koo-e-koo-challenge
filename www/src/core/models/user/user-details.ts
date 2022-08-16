import { UserDTO } from "../../generated/UserDto";

export interface UserDetails {
  nonce: string;
  address: string;
  token: string;
}

export namespace UserDetails {
  export function mapToApiValue(data: UserDTO): UserDetails {
    return {
      nonce: data.data.nonce,
      address: data.data.address,
      token: data.access_token,
    };
  }
}
