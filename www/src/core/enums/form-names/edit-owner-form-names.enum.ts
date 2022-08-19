import { OwnerData } from "../../models";
import { IMap } from "../../utils";

export enum CreateOwnerFormNamesEnum {
  Name = 1,
  Address = 2,
}

export namespace CreateOwnerFormNamesEnum {
  export type formFieldName = keyof OwnerData;

  export const toLabel: IMap<CreateOwnerFormNamesEnum, string> = new IMap<
    CreateOwnerFormNamesEnum,
    string
  >([
    [CreateOwnerFormNamesEnum.Name, "Name"],
    [CreateOwnerFormNamesEnum.Address, "Address"],
  ]);

  export const toPlaceholder: IMap<CreateOwnerFormNamesEnum, string> = new IMap<
    CreateOwnerFormNamesEnum,
    string
  >([
    [CreateOwnerFormNamesEnum.Name, "Owner Name"],
    [CreateOwnerFormNamesEnum.Address, "0x..."],
  ]);

  export const field: IMap<CreateOwnerFormNamesEnum, formFieldName> = new IMap<
    CreateOwnerFormNamesEnum,
    formFieldName
  >([
    [CreateOwnerFormNamesEnum.Name, "name"],
    [CreateOwnerFormNamesEnum.Address, "address"],
  ]);
}
