import React from "react";
import { CircularProgress, Grid, Paper } from "@mui/material";
import { CONSTANTS } from "core/constant";
import LogoutIcon from "@mui/icons-material/Logout";
import styles from "./safe.module.scss";
import { Button } from "shared/components";
import EditIcon from "@mui/icons-material/Edit";

interface SafeCardProps {
  address: string | undefined;
  threshold: number | undefined;
  balance: string | undefined;
  title: string;
  loading: boolean;
  handleDisconnect: () => void;
  handleEdit: () => void;
}

export default function SafeCard(props: SafeCardProps) {
  return (
    <Paper>
      <Grid container className={styles.safe_card}>
        <Grid container justifyContent="space-between" alignItems="center">
          <h3>{props.title}</h3>
          <Grid>
            <Button
              startIcon={<EditIcon />}
              toolTip="Edit"
              onClick={props.handleEdit}
            />
            <Button
              startIcon={<LogoutIcon />}
              onClick={props.handleDisconnect}
              toolTip="Disconnect"
            />
          </Grid>
        </Grid>
        {props.loading ? (
          <Grid container justifyContent="center">
            <CircularProgress />
          </Grid>
        ) : (
          <>
            {" "}
            <Grid container className={styles.safe_card_item}>
              <b className={styles.safe_card_sub_title}>Address:</b>
              <a
                href={`${CONSTANTS.rinkebyLink}address/${props.address}`}
                target="blank"
              >
                {props.address}
              </a>
            </Grid>
            <Grid container className={styles.safe_card_item}>
              <b className={styles.safe_card_sub_title}>Threshold:</b>
              {props.threshold}
            </Grid>
            <Grid container className={styles.safe_card_item}>
              <b className={styles.safe_card_sub_title}> Total Balance:</b>
              {props.balance} ETH
            </Grid>
          </>
        )}
      </Grid>
    </Paper>
  );
}
