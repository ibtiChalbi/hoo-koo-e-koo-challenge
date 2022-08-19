export interface AddSafeData {
  name: string;
  address?: string;
  threshold: number | undefined;
}

export namespace AddSafeData {
  export function mapToApiValue(data: AddSafeData): AddSafeData {
    return {
      name: data.name,
      address: data.address,
      threshold: data.threshold,
    };
  }
}
