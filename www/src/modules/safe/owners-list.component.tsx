import React from "react";
import { Grid } from "@mui/material";
import { Button } from "@mui/material";
import CustomTable from "shared/components/CustomTable/custom-table.component";
import { TableHeaderEnum } from "core/enums/table-header/table-header.enum";
import styles from "./safe.module.scss";

interface OwnersListProps {
  owners: {
    name: string;
    address: string;
  }[];
  loading: boolean;
}

const OwnersList: React.FC<OwnersListProps> = (props: OwnersListProps) => {
  return (
    <Grid container justifyContent="center">
      <Grid container justifyContent="flex-end" className={styles.add_button}>
        <Button variant="contained">Add owner</Button>
      </Grid>
      <CustomTable
        list={props.owners}
        loading={props.loading}
        headers={TableHeaderEnum.ownersItems}
        canDelete
        canEdit
        canView
        handleView={() => {
          console.log("handleView");
        }}
        handleEdit={() => {
          console.log("handleEdit");
        }}
        handleDelete={() => {
          console.log("handleDelete");
        }}
      />
    </Grid>
  );
};

export default OwnersList;
