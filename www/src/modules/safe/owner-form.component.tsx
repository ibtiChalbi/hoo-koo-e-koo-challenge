import React from "react";
import { Button, Form, Input } from "shared/components";
import { Field } from "react-final-form";
import {
  CreateOwnerFormNamesEnum,
  FormIdEnum,
  SafeFormTypes,
} from "core/enums";
import { OwnerData } from "core/models";
import { Validators } from "shared/validators";

interface OwnerFormProps {
  submit: (value: OwnerData) => void;
  loading: boolean;
  initialData?: OwnerData | null;
  type?: SafeFormTypes.CreateSafe | "";
}

const OwnerForm: React.FC<OwnerFormProps> = (props: OwnerFormProps) => {
  return (
    <Form
      formId={FormIdEnum.EditOwner}
      initialValues={props.initialData}
      onSubmit={props.submit}
    >
      <Field
        name={CreateOwnerFormNamesEnum.field.getValue(
          CreateOwnerFormNamesEnum.Name
        )}
      >
        {(field) => (
          <Input
            label={CreateOwnerFormNamesEnum.toLabel.getValue(
              CreateOwnerFormNamesEnum.Name
            )}
            placeholder={CreateOwnerFormNamesEnum.toPlaceholder.getValue(
              CreateOwnerFormNamesEnum.Name
            )}
            meta={field.meta}
            input={field.input}
          />
        )}
      </Field>
      {props.type === SafeFormTypes.CreateSafe && (
        <Field
          name={CreateOwnerFormNamesEnum.field.getValue(
            CreateOwnerFormNamesEnum.Address
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
              label={CreateOwnerFormNamesEnum.toLabel.getValue(
                CreateOwnerFormNamesEnum.Address
              )}
              placeholder={CreateOwnerFormNamesEnum.toPlaceholder.getValue(
                CreateOwnerFormNamesEnum.Address
              )}
              meta={field.meta}
              input={field.input}
            />
          )}
        </Field>
      )}
      <Button
        htmlType="submit"
        type="secondary"
        label="Validate"
        size="large"
        spinning={props.loading}
        disabled={props.loading}
      />
    </Form>
  );
};

export default OwnerForm;
