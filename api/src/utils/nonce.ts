import * as ethUtil from "ethereumjs-util";

/**
 * generateNonce : return timestamp en milliseconds (provide unique value hard to replicate)
 * @return string
 */
export const generateNonce = (): string => {
  return new Date().getTime().toString();
};

/**
 * checkSignature check if signature provided by wallet is the same as nonce created
 * @param signature
 * @param nonce
 * @return boolean
 */
export const checkSignature = (signature: string, nonce: string): string => {
  const msg = `Welcome! Please sign this transaction to connect your wallet. ${nonce}`;
  // Convert msg to hex string
  let buffer = Buffer.from(msg);
  const msgHex = ethUtil.bufferToHex(buffer);

  // Check if signature is valid
  const msgBuffer = ethUtil.toBuffer(msgHex);
  const msgHash = ethUtil.hashPersonalMessage(msgBuffer);

  const signatureBuffer = ethUtil.toBuffer(signature);
  const signatureParams = ethUtil.fromRpcSig(signature);

  const publicKey = ethUtil.ecrecover(
    msgHash,
    signatureParams.v,
    signatureParams.r,
    signatureParams.s
  );
  const addressBuffer = ethUtil.publicToAddress(publicKey);
  const address = ethUtil.bufferToHex(addressBuffer);
  return address.toLowerCase();
};
