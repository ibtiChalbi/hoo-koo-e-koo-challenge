import { Grid, TextField } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import React, { useState } from "react";
import { inputTheme } from "shared/theme";
import { Button } from "..";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import { FieldInputProps, FieldMetaState } from "react-final-form";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
declare type InputType = "password" | "number" | "search" | "email" | "text";
declare type InputSize = "medium" | "small" | undefined;
declare type InputColor = "primary" | "secondary";

interface InputProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  meta: FieldMetaState<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  input: FieldInputProps<any, any>;
  label?: string;
  disabled?: boolean;
  placeholder?: string;
  required?: boolean;
  multiline?: boolean;
  defaultValue?: string;
  inputLabel?: string;
  helperText?: string;
  type?: InputType;
  size?: InputSize;
  className?: string;
  color?: InputColor;
  max?: number;
}

/**
 * Component InputList
 *
 * @component
 *
 * @example
 * return (
 *   <InputList />
 * )
 */
export function InputList(props: InputProps): JSX.Element {
  const [list, setList] = useState([...props.meta.initial]);

  const handleChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    index: number
  ) => {
    const value = event.target.value;
    const newList = [...list];
    newList[index] = value;
    setList([...newList]);
    props.input.onChange(newList);
  };

  const addInput = () => {
    setList((prev) => [...prev, ""]);
    props.input.onChange([...list, ""]);
  };

  const removeInput = (index: number) => {
    const filtredList = list.filter((_item, filterindex) => {
      return index !== filterindex;
    });
    setList([...filtredList]);
    props.input.onChange(filtredList);
  };

  return (
    <ThemeProvider theme={inputTheme}>
      <h3>{props.label}</h3>
      {list.map((item, index) => (
        <Grid container alignItems="center" key={`input-${index}`}>
          <Grid item md={11}>
            <TextField
              {...props.input}
              defaultValue={props.defaultValue}
              id={props.input.name + "-" + props.label}
              label={props.inputLabel || ""}
              placeholder={props.placeholder || ""}
              required={props.required}
              fullWidth={true}
              color={props.color ? props.color : "primary"}
              helperText={
                props?.meta?.touched &&
                !!props?.meta?.error && (
                  <span
                    style={{
                      marginTop: "0.125rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {props?.meta?.error || props.helperText}
                  </span>
                )
              }
              error={props?.meta?.touched && !!props?.meta?.error}
              onChange={(event) => handleChange(event, index)}
              variant="outlined"
              value={list[index]}
            />
          </Grid>
          <Grid item md={1}>
            {list.length > 1 && (
              <Button
                startIcon={<ClearRoundedIcon />}
                onClick={() => removeInput(index)}
              />
            )}
          </Grid>
        </Grid>
      ))}
      {(!props.max || list.length <= props.max) && (
        <Button
          label={"Add owner"}
          startIcon={<AddRoundedIcon />}
          onClick={addInput}
          variant="text"
        />
      )}
    </ThemeProvider>
  );
}
