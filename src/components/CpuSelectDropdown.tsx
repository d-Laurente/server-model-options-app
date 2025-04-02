import React from "react"
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from "@mui/material";

interface CpuSelectDropdownProps {
  cpu: string;
  cpuOptions: Array<string>;
  onChange: (event: SelectChangeEvent) => void;
  sx?: object;
}

const CpuSelectDropdown: React.FC<CpuSelectDropdownProps> = ({ cpu, cpuOptions, onChange, sx }) => {
  return (
    <FormControl sx={sx}>
      <InputLabel id="select-cpu">CPU</InputLabel>
      <Select
        id="select-cpu"
        name="cpu-select"
        value={cpu}
        label="CPU"
        onChange={onChange}
      >
        {cpuOptions.map((cpu: string) => (
          <MenuItem
            key={cpu}
            value={cpu}
          >
            {cpu}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default CpuSelectDropdown;
