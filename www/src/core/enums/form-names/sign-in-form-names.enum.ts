import { SendTransactionData } from "../../models";
import { IMap } from "../../utils";

export enum SendTransactionFormNamesEnum {
  Adddress = 1,
  Value = 2,
}

export namespace SendTransactionFormNamesEnum {
  export type formFieldName = keyof SendTransactionData;

  export const toLabel: IMap<SendTransactionFormNamesEnum, string> = new IMap<
    SendTransactionFormNamesEnum,
    string
  >([
    [SendTransactionFormNamesEnum.Adddress, "Adddress"],
    [SendTransactionFormNamesEnum.Value, "Value"],
  ]);

  export const toPlaceholder: IMap<SendTransactionFormNamesEnum, string> =
    new IMap<SendTransactionFormNamesEnum, string>([
      [SendTransactionFormNamesEnum.Adddress, "0x..."],
      [SendTransactionFormNamesEnum.Value, "Value"],
    ]);

  export const field: IMap<SendTransactionFormNamesEnum, formFieldName> =
    new IMap<SendTransactionFormNamesEnum, formFieldName>([
      [SendTransactionFormNamesEnum.Adddress, "address"],
      [SendTransactionFormNamesEnum.Value, "value"],
    ]);
}
