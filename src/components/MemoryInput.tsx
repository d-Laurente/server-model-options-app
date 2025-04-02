import React from "react";
import { ChangeEvent } from "react";
import { FormControl, InputAdornment } from "@mui/material";
import TextField from "@mui/material/TextField";
import { formatNumberWithCommas } from "../utils/helpers";

interface MemoryInputProps {
  memorySize: number | undefined;
  memoryFieldHelperText: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  sx?: object;
}

const MemoryInput: React.FC<MemoryInputProps> = ({ memorySize, memoryFieldHelperText, onChange, sx }) => {
  return (
    <FormControl variant="outlined" sx={sx}>
      <TextField
        id="input-memory-size"
        name="memory-size-input"
        onChange={onChange}
        helperText={memoryFieldHelperText}
        label="Memory Size"
        slotProps={{
          input: {
            endAdornment: <InputAdornment position="end">MB</InputAdornment>,
          },
        }}
        value={formatNumberWithCommas(memorySize)}
      />
    </FormControl>
  );
}

export default MemoryInput
