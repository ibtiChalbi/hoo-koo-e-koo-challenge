import React from "react";
import { Grid, Paper } from "@mui/material";
import styles from "./safe.module.scss";
import CustomTabs from "shared/components/CustomTabs/custom-tabs.component";
import SafeConnectForm from "./safe-form.component";
import { AddSafeData } from "core/models";
import { SafeFormTypes } from "core/enums";

interface AddSafeProps {
  connectSafe: (value: AddSafeData) => void;
  createSafe: (value: AddSafeData) => void;
  connectLoading: boolean;
  defaultAddress: string;
}

const AddSafe: React.FC<AddSafeProps> = (props: AddSafeProps) => {
  return (
    <Grid container>
      <Paper className={styles.add_safe_form}>
        <CustomTabs
          disabled={props.connectLoading}
          tabs={[
            {
              title: "Create New Safe",
              content: (
                <SafeConnectForm
                  type={SafeFormTypes.CreateSafe}
                  submit={props.createSafe}
                  connectLoading={props.connectLoading}
                  initialData={{
                    name: "",
                    threshold: 1,
                    owners: [props.defaultAddress],
                  }}
                />
              ),
            },
            {
              title: "Connect Existing Safe",
              content: (
                <SafeConnectForm
                  type={SafeFormTypes.ConnectSafe}
                  submit={props.connectSafe}
                  connectLoading={props.connectLoading}
                />
              ),
            },
          ]}
        />
      </Paper>
    </Grid>
  );
};

export default AddSafe;
