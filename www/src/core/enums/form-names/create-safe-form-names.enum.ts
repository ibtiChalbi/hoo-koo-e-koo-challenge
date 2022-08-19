import { AddSafeData } from "../../models";
import { IMap } from "../../utils";

export enum CreateSafeFormNamesEnum {
  Name = 1,
  Address = 2,
  Threshold = 3,
  Owners = 4,
}

export namespace CreateSafeFormNamesEnum {
  export type formFieldName = keyof AddSafeData;

  export const toLabel: IMap<CreateSafeFormNamesEnum, string> = new IMap<
    CreateSafeFormNamesEnum,
    string
  >([
    [CreateSafeFormNamesEnum.Name, "Name"],
    [CreateSafeFormNamesEnum.Address, "Address"],
    [CreateSafeFormNamesEnum.Threshold, "Threshold"],
    [CreateSafeFormNamesEnum.Owners, "Owner"],
  ]);

  export const toPlaceholder: IMap<CreateSafeFormNamesEnum, string> = new IMap<
    CreateSafeFormNamesEnum,
    string
  >([
    [CreateSafeFormNamesEnum.Name, "Safe Name"],
    [CreateSafeFormNamesEnum.Address, "0x..."],
    [CreateSafeFormNamesEnum.Threshold, "Threshold"],
    [CreateSafeFormNamesEnum.Owners, "0x..."],
  ]);

  export const field: IMap<CreateSafeFormNamesEnum, formFieldName> = new IMap<
    CreateSafeFormNamesEnum,
    formFieldName
  >([
    [CreateSafeFormNamesEnum.Name, "name"],
    [CreateSafeFormNamesEnum.Address, "address"],
    [CreateSafeFormNamesEnum.Threshold, "threshold"],
    [CreateSafeFormNamesEnum.Owners, "owners"],
  ]);
}
