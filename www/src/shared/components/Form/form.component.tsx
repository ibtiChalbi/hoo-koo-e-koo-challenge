import React from "react";
import { FormIdEnum } from "core/enums";
import { Form as FormFinal } from "react-final-form";

interface FormProps {
  formId: FormIdEnum;
  children: React.ReactNode;
  className?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialValues: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (data: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validate?: (data: any) => any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange?: (data: any) => any;
}

export const Form = (props: FormProps) => {
  return (
    <FormFinal
      initialValues={props.initialValues}
      onSubmit={props.onSubmit}
      id={props.formId}
      validate={props.validate}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit} onChange={props.onChange}>
          {props.children}
        </form>
      )}
    />
  );
};
