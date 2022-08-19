export interface AddSafeData {
  name: string;
  address?: string;
  threshold: number | undefined;
  owners?: string[];
}

export namespace AddSafeData {
  export function mapToApiValue(data: AddSafeData): AddSafeData {
    return {
      name: data.name,
      address: data.address,
      threshold: data.threshold,
      owners: data.owners,
    };
  }
}
