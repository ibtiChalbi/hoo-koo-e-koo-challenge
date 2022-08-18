import React from "react";
import { Grid } from "@mui/material";
import SafeDetails from "modules/safe/safe.component";

const SafePage: React.FC = () => {
  return (
    <Grid container direction="column">
      <SafeDetails />
    </Grid>
  );
};

export default SafePage;
