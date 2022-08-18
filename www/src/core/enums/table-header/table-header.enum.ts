import { SelectItemData } from "../../../shared/interfaces";
import { IMap } from "../../utils";

export enum TableHeaderEnum {
  Block = "blockNumber",
  From = "from",
  To = "to",
  Value = "value",
  Hash = "hash",
  Channel = "channel",
  Address = "address",
  Name = "name",
  Action = "action",
}

export namespace TableHeaderEnum {
  const transactionsHeaders: TableHeaderEnum[] = [
    TableHeaderEnum.Block,
    TableHeaderEnum.Channel,
    TableHeaderEnum.From,
    TableHeaderEnum.To,
    TableHeaderEnum.Value,
    TableHeaderEnum.Hash,
  ];
  const ownersHeaders: TableHeaderEnum[] = [
    TableHeaderEnum.Address,
    TableHeaderEnum.Name,
    TableHeaderEnum.Action,
  ];

  export const toString = new IMap<TableHeaderEnum, string>([
    [TableHeaderEnum.Block, "Block"],
    [TableHeaderEnum.From, "from"],
    [TableHeaderEnum.To, "To"],
    [TableHeaderEnum.Value, "Value"],
    [TableHeaderEnum.Hash, "Hash"],
    [TableHeaderEnum.Channel, ""],
    [TableHeaderEnum.Address, "Address"],
    [TableHeaderEnum.Name, "Name"],
  ]);

  export function mapToSelectItem(
    item: TableHeaderEnum
  ): SelectItemData<TableHeaderEnum> {
    return {
      value: item,
      name: toString.getValue(item),
    };
  }

  export const ownersItems = ownersHeaders.map((item) => mapToSelectItem(item));

  export const transactionsItems = transactionsHeaders.map((item) =>
    mapToSelectItem(item)
  );
}
