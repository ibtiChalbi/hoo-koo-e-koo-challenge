import { Grid } from "@mui/material";
import { FormIdEnum, SendTransactionFormNamesEnum } from "core/enums";
import { SendTransactionData } from "core/models";
import React, { useEffect, useState } from "react";
import { Button, Form, Input } from "shared/components";
import { Validators } from "shared/validators";
import { Field } from "react-final-form";
import { usePrepareSendTransaction, useSendTransaction } from "wagmi";
import { parseEther } from "ethers/lib/utils";

type SendTransactionProps = {
  transactionDone?: () => void;
};
const SendTransaction: React.FC<SendTransactionProps> = ({
  transactionDone,
}) => {
  const [requestData, setRequestData] = useState<SendTransactionData | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const { config } = usePrepareSendTransaction({
    request: {
      to: requestData?.address,
      value: requestData?.value ? parseEther(requestData?.value) : 0,
    },
    onError: () => {
      setLoading(false);
    },
    onSettled: () => {
      setLoading(false);
    },
  });
  const { sendTransaction, isLoading, isSuccess } = useSendTransaction(config);

  const submitForm = (values: SendTransactionData) => {
    setLoading(true);
    setRequestData({ ...values });
  };

  useEffect(() => {
    if (!isLoading && isSuccess) {
      const timer = setTimeout(() => {
        transactionDone?.();
        setLoading(false);
      }, 20000);
      return () => {
        clearTimeout(timer);
      };
    } else if (!isLoading) {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isSuccess]);

  useEffect(() => {
    if (requestData && requestData?.address) {
      sendTransaction?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestData]);

  return (
    <Grid container>
      <Form
        formId={FormIdEnum.SendTransaction}
        initialValues={{}}
        onSubmit={submitForm}
      >
        <Field
          name={SendTransactionFormNamesEnum.field.getValue(
            SendTransactionFormNamesEnum.Adddress
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
              label={SendTransactionFormNamesEnum.toLabel.getValue(
                SendTransactionFormNamesEnum.Adddress
              )}
              placeholder={SendTransactionFormNamesEnum.toPlaceholder.getValue(
                SendTransactionFormNamesEnum.Adddress
              )}
              meta={field.meta}
              input={field.input}
            />
          )}
        </Field>
        <Field
          name={SendTransactionFormNamesEnum.field.getValue(
            SendTransactionFormNamesEnum.Value
          )}
          validate={(value: number) =>
            Validators.required("The value is required")(value) ||
            Validators.isBiggerOrEqualTo(0, "The value is required")(value)
          }
        >
          {(field) => (
            <Input
              label={SendTransactionFormNamesEnum.toLabel.getValue(
                SendTransactionFormNamesEnum.Value
              )}
              placeholder={SendTransactionFormNamesEnum.toPlaceholder.getValue(
                SendTransactionFormNamesEnum.Value
              )}
              meta={field.meta}
              input={field.input}
              type="number"
            />
          )}
        </Field>
        <Button
          htmlType="submit"
          type="secondary"
          label="Valider"
          size="large"
          fullWidth={true}
          spinning={loading}
          disabled={loading}
        />
      </Form>
    </Grid>
  );
};

export default SendTransaction;
