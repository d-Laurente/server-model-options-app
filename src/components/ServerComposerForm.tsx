import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { SelectChangeEvent } from "@mui/material/Select";

import CpuSelectDropdown from "./CpuSelectDropdown";
import MemoryInput from "./MemoryInput";
import { ServerComposerFormInputs, ServerComposerFormErrors, CPU_OPTIONS } from "../types/server";

interface ServerComposerFormProps {
  formInputs: ServerComposerFormInputs;
  errors: ServerComposerFormErrors;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const ServerComposerForm: React.FC<ServerComposerFormProps> = ({ formInputs, errors, onChange, onSubmit }) => {

  return (
    <Box component="form" onSubmit={onSubmit} display="flex" flexDirection="column" rowGap="25px" marginY="25px">
      <Box display="flex" flexDirection="row" columnGap="40px" flexWrap="wrap" alignItems="flex-start" height="70px">
        <CpuSelectDropdown
          cpu={formInputs.cpu}
          cpuOptions={CPU_OPTIONS}
          onChange={onChange}
          sx={{ width: "250px" }}
        />
        <MemoryInput
          memorySize={formInputs.memorySize}
          memoryFieldHelperText={errors.memoryError}
          onChange={onChange}
          sx={{ width: "275px" }}
        />
        <FormControlLabel
          control={
            <Checkbox checked={formInputs.isGpuAccelerated} onChange={onChange}/>
          }
          name="is-gpu-accelerated-checkbox"
          label="GPU Accelerated Card"
          sx={{ width: "250px" }}
        />
      </Box>
      <Button 
        variant="text" 
        type="submit" 
        sx={{
          width: "85px", 
          textTransform: "capitalize", 
          borderRadius: 2,
          backgroundColor: "#e1e1e1",
          color: "black",
          border: 1,
          borderColor: "#868686"
        }}
      >
        Submit
      </Button>
    </Box>
  );
}

export default ServerComposerForm;
