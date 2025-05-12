import React from "react";
import { encodeOp, encodeOps } from "hive-uri";
import { QRCode } from "react-qrcode-logo";

export const HiveQRCode = ({ ops, op, withLogo = false, ...props }) => {
  let value = "";
  if (ops) {
    value = encodeOps(ops);
  } else if (op) {
    value = encodeOp(op);
  }

  return (
    <QRCode
      logoImage={withLogo ? "img/logohive.svg" : undefined}
      removeQrCodeBehindLogo
      enableCORS
      value={value}
      {...props}
    />
  );
};
