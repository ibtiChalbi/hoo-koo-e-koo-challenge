import React, { ReactElement } from "react";
import { Grid } from "@mui/material";
import styles from "./layouts.module.scss";
import MainHeader from "./header.component";

interface LayoutProps {
  children: ReactElement;
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
      <Grid container>{props.children}</Grid>
    </Grid>
  );
};
export default Layout;
