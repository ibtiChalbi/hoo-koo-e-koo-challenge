import React from "react";
import { CircularProgress, Grid, Paper } from "@mui/material";
import { RINKEBY_link } from "core/constant";
import DeleteIcon from "@mui/icons-material/Delete";
import styles from "./safe.module.scss";
import { Button } from "shared/components";
import EditIcon from "@mui/icons-material/Edit";

interface SafeCardProps {
  address: string | undefined;
  threshold: number | undefined;
  balance: string | undefined;
  title: string;
  loading: boolean;
}

export default function SafeCard(props: SafeCardProps) {
  return (
    <Paper>
      <Grid container className={styles.safe_card}>
        <Grid container justifyContent="space-between" alignItems="center">
          <h3>{props.title}</h3>
          <Grid>
            <Button startIcon={<EditIcon />} />
            <Button startIcon={<DeleteIcon />} />
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
                href={`${RINKEBY_link}address/${props.address}`}
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
