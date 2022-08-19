import React from "react";
import { Button, Form, Input } from "shared/components";
import { Field } from "react-final-form";
import { CreateSafeFormNamesEnum, FormIdEnum, SafeFormTypes } from "core/enums";
import { Validators } from "shared/validators";
import { AddSafeData } from "core/models";

interface SafeFormProps {
  submit: (value: AddSafeData) => void;
  connectLoading: boolean;
  type:
    | SafeFormTypes.ConnectSafe
    | SafeFormTypes.CreateSafe
    | SafeFormTypes.EditSafe;
  initialData?: AddSafeData;
}

const SafeForm: React.FC<SafeFormProps> = (props: SafeFormProps) => {
  return (
    <Form
      formId={FormIdEnum.ConnectSafe}
      initialValues={props.initialData}
      onSubmit={props.submit}
    >
      {(props.type === SafeFormTypes.CreateSafe ||
        props.type === SafeFormTypes.EditSafe) && (
        <Field
          name={CreateSafeFormNamesEnum.field.getValue(
            CreateSafeFormNamesEnum.Name
          )}
        >
          {(field) => (
            <Input
              label={CreateSafeFormNamesEnum.toLabel.getValue(
                CreateSafeFormNamesEnum.Name
              )}
              placeholder={CreateSafeFormNamesEnum.toPlaceholder.getValue(
                CreateSafeFormNamesEnum.Name
              )}
              meta={field.meta}
              input={field.input}
            />
          )}
        </Field>
      )}
      {props.type !== SafeFormTypes.EditSafe && (
        <Field
          name={CreateSafeFormNamesEnum.field.getValue(
            CreateSafeFormNamesEnum.Address
          )}
          validate={(value: string) =>
            Validators.required("The address is required")(value) ||
            Validators.isEthereumAddress(
              "The address should be a valid Ethereum address"
            )(value)
          }
        >
          {(field) => (
            <Input
              label={CreateSafeFormNamesEnum.toLabel.getValue(
                CreateSafeFormNamesEnum.Address
              )}
              placeholder={CreateSafeFormNamesEnum.toPlaceholder.getValue(
                CreateSafeFormNamesEnum.Address
              )}
              meta={field.meta}
              input={field.input}
            />
          )}
        </Field>
      )}
      {props.type === SafeFormTypes.EditSafe && (
        <Field
          name={CreateSafeFormNamesEnum.field.getValue(
            CreateSafeFormNamesEnum.Threshold
          )}
          validate={(value: number) =>
            Validators.isBiggerOrEqualTo(
              1,
              "The Threshold should be bigger than zero"
            )(value)
          }
        >
          {(field) => (
            <Input
              label={CreateSafeFormNamesEnum.toLabel.getValue(
                CreateSafeFormNamesEnum.Threshold
              )}
              placeholder={CreateSafeFormNamesEnum.toPlaceholder.getValue(
                CreateSafeFormNamesEnum.Threshold
              )}
              meta={field.meta}
              input={field.input}
              type="number"
            />
          )}
        </Field>
      )}
      <Button
        htmlType="submit"
        type="secondary"
        label="Validate"
        size="large"
        spinning={props.connectLoading}
        disabled={props.connectLoading}
      />
    </Form>
  );
};

export default SafeForm;
