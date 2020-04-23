import React from "react";

const FormError = ({ children }) => {
  return (
    typeof children !== "object" && (
      <div className="field-error">{children}</div>
    )
  );
};

export default FormError;
