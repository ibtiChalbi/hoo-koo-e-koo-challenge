import { isAddress } from "ethers/lib/utils";

const digitRegex = new RegExp(/[+-]?([0-9]*[.])?[0-9]+/);
export namespace Validators {
  export const required = (message: string) => (value: number | string) =>
    value ? "" : message;

  export const length =
    (requiredLength: number, message?: string) => (value: number | string) =>
      value?.toString().length !== requiredLength ? message : "";

  export const isDigit = (message: string) => (value: string) =>
    digitRegex.test(value) ? "" : message;

  export const isBiggerOrEqualTo =
    (compare: number, message: string) => (value: number) =>
      value >= compare ? "" : message;

  export const isEthereumAddress = (message: string) => (value: string) =>
    isAddress(value) ? "" : message;

  export const isEthereumArray = (value: string[]) =>
    !value.find((elem) => isAddress(elem));

  export const arrayNotEmpty = (value: string[]) => value.includes("");

  export const checkForDuplicates = (value: string[]) =>
    value.filter((item, index, array) => {
      return array.findIndex((t) => t === item) === index;
    }).length !== value.length;
}
