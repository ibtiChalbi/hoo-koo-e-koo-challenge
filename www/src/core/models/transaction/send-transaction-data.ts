export interface SendTransactionData {
  address: string;
  value: string;
}

export namespace SendTransactionData {
  export function mapToApiValue(
    data: SendTransactionData
  ): SendTransactionData {
    return {
      address: data.address,
      value: data.value,
    };
  }
}
