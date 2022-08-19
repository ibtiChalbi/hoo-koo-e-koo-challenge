import React from "react";
import { Grid } from "@mui/material";
import { Button } from "@mui/material";
import CustomTable from "shared/components/CustomTable/custom-table.component";
import { TableHeaderEnum } from "core/enums/table-header/table-header.enum";
import styles from "./safe.module.scss";
import { CONSTANTS } from "core/constant";

interface OwnersListProps {
  owners: {
    name: string;
    address: string;
  }[];
  loading: boolean;
  handleDelete: (data: any) => void;
  handleUpdate: (data: any) => void;
  handleAddOwner: () => void;
}

const OwnersList: React.FC<OwnersListProps> = (props: OwnersListProps) => {
  return (
    <Grid container justifyContent="center">
      <Grid container justifyContent="flex-end" className={styles.add_button}>
        <Button variant="contained" onClick={props.handleAddOwner}>
          Add owner
        </Button>
      </Grid>
      <CustomTable
        list={props.owners}
        loading={props.loading}
        headers={TableHeaderEnum.ownersItems}
        canDelete
        canEdit
        canView
        handleDelete={(data) => props.handleDelete(data.address)}
        handleEdit={(data) => props.handleUpdate(data)}
        handleView={(data) => {
          window.open(
            `${CONSTANTS.rinkebyLink}address/${data.address}`,
            "_blank"
          );
        }}
      />
    </Grid>
  );
};

export default OwnersList;
