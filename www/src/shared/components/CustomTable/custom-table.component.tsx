import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { SelectItemData } from "shared/interfaces";
import { CircularProgress, Grid, ThemeProvider } from "@mui/material";
import { tableTheme } from "shared/theme/table-theme";
import { TableHeaderEnum } from "core/enums/table-header/table-header.enum";
import { CONSTANTS } from "core/constant";
import { useAccount } from "wagmi";
import { formatEther } from "ethers/lib/utils";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import EditIcon from "@mui/icons-material/Edit";
import { Button } from "../Button/button.component";
import DeleteIcon from "@mui/icons-material/Delete";

interface CustomTableProps {
  list: any[];
  loading: boolean;
  headers: SelectItemData<TableHeaderEnum>[];
  canDelete?: boolean;
  canEdit?: boolean;
  canView?: boolean;
  canReject?: boolean;
  canConfirm?: boolean;
  handleView?: (data: any) => void;
  handleEdit?: (data: any) => void;
  handleDelete?: (data: any) => void;
}

/**
 * Component CustomTable
 *
 * @component
 *
 * @example
 * return (
 *   <CustomTable list={[]} loading={false} headers={[]} />
 * )
 */
export default function CustomTable(props: CustomTableProps) {
  const { address } = useAccount();

  return (
    <>
      <ThemeProvider theme={tableTheme}>
        <TableContainer component={Paper}>
          <Table aria-label="custom table">
            <TableHead>
              <TableRow>
                {props.headers.map((row, index) => (
                  <TableCell
                    align="left"
                    key={`table-header-${index}-${row.name}`}
                  >
                    {row.name}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {props.loading ? (
                <TableRow>
                  <TableCell align="center" colSpan={props.headers.length}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : props.list.length > 0 ? (
                props.list.map((row, index) => (
                  <TableRow key={`table-row-${index}`}>
                    {props.headers.map((data, indexCell) => (
                      <TableCell
                        align="left"
                        key={`table-cell-${indexCell}-${data.name}`}
                        className={data.value}
                      >
                        {data?.value === TableHeaderEnum.Action ? (
                          <Grid container justifyContent="flex-end">
                            {props.canView && (
                              <Button
                                startIcon={<RemoveRedEyeIcon />}
                                onClick={() => props.handleView?.(row)}
                                toolTip="View"
                              />
                            )}
                            {props.canEdit && (
                              <Button
                                startIcon={<EditIcon />}
                                toolTip="Edit"
                                onClick={() => props.handleEdit?.(row)}
                              />
                            )}
                            {props.canDelete && (
                              <Button
                                startIcon={<DeleteIcon />}
                                onClick={() => props.handleDelete?.(row)}
                                toolTip="Delete"
                              />
                            )}
                          </Grid>
                        ) : !row[data?.value]?.toString() ? (
                          "--"
                        ) : data?.value === TableHeaderEnum.Hash ? (
                          <a
                            href={`${CONSTANTS.rinkebyLink}tx/${row[
                              data?.value
                            ]?.toString()}`}
                            target="blank"
                          >
                            View Transaction
                          </a>
                        ) : data?.value === TableHeaderEnum.Channel ? (
                          <div className={"transaction_button"}>
                            {row.to === address && row.from === address ? (
                              <div className={"self"}>self</div>
                            ) : row.to === address ? (
                              <div className={"in"}>in</div>
                            ) : (
                              <div className={"out"}>out</div>
                            )}
                          </div>
                        ) : data?.value === TableHeaderEnum.Value ? (
                          <>{formatEther(row[data?.value])} Ether</>
                        ) : data?.value === TableHeaderEnum.Address ||
                          data?.value === TableHeaderEnum.To ||
                          data?.value === TableHeaderEnum.From ? (
                          <a
                            href={`${CONSTANTS.rinkebyLink}address/${row[
                              data?.value
                            ]?.toString()}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {row[data?.value]?.toString()}
                          </a>
                        ) : data?.value === TableHeaderEnum.Transaction ? (
                          <a
                            href={`${CONSTANTS.rinkebyLink}tx/${row[
                              data?.value
                            ]?.toString()}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {row[data?.value]?.toString()}
                          </a>
                        ) : data?.value === TableHeaderEnum.Status ? (
                          row[data?.value] ? (
                            <div className="success"> Success</div>
                          ) : (
                            <div className="rejected"> Rejected</div>
                          )
                        ) : (
                          row[data?.value]?.toString()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    align="center"
                    colSpan={props.headers.length}
                    className={"no_data"}
                  >
                    No data available try again later
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </ThemeProvider>
    </>
  );
}
