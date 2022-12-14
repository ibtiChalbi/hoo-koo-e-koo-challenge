import React from "react";
import { Grid } from "@mui/material";
import Transactions from "modules/transactions/transactions.component";

const Homepage: React.FC = () => {
  return (
    <Grid container direction="column">
      <Transactions />
    </Grid>
  );
};

export default Homepage;
