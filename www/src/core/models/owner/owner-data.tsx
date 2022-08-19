export interface OwnerData {
  name: string;
  address: string;
}

export namespace OwnerData {
  export function mapToApiValue(data: OwnerData): OwnerData {
    return {
      name: data.name,
      address: data.address,
    };
  }
}
