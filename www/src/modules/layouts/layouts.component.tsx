import React, { ReactElement } from "react";
import { Grid } from "@mui/material";
import styles from "./layouts.module.scss";
import MainHeader from "./header.component";

interface LayoutProps {
  children: ReactElement;
  title: string;
}

/**
 * Component Layout
 *
 * @component
 *
 * @example
 * return (
 *   <Layout>...</Layout>
 * )
 */
export const Layout = (props: LayoutProps) => {
  return (
    <Grid container className={styles.app_container}>
      <MainHeader />
      <Grid container direction="column">
        <h1>{props.title}</h1>
        {props.children}
      </Grid>
    </Grid>
  );
};
export default Layout;
