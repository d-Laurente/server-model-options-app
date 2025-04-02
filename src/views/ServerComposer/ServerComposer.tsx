import React, { useState } from "react";
import Divider from "@mui/material/Divider";
import ServerOptionsDisplay from "../../components/ServerOptionsDisplay";
import { determineServerOptions } from "../../utils/serverOptionsCalculator";
import ServerComposerForm from "../../components/ServerComposerForm";
import { useServerComposerForm } from "../../hooks/useServerComposerForm";

import "./ServerComposer.css"

const ServerComposer: React.FC = () => {
  const { formInputs, errors, handleInputChange, validateForm } = useServerComposerForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const [serverOptions, setServerOptions] = useState<Array<string>>([]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    setIsSubmit(true);
    if (!validateForm()) {
      return;
    }

    const options = determineServerOptions(formInputs);
    setServerOptions(options);
  }

  return (
    <div className="server-composer-container">
      <h1>Server Composer</h1>
      <ServerComposerForm 
        formInputs={formInputs}
        errors={errors}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
      />
      {isSubmit && (
        <>
          <Divider />
          <ServerOptionsDisplay serverOptions={serverOptions}/>
        </>
      )}
    </div>
  );
}

export default ServerComposer;
