import { useState, ChangeEvent } from "react";
import { SelectChangeEvent } from "@mui/material/Select";
import { ServerComposerFormInputs, ServerComposerFormErrors } from "../types/server";
import { isPowerOfTwo } from "../utils/helpers";
import { ERROR_MESSAGES, MAX_MEMORY_SIZE, MEMORY_SIZE_MULTIPLE, MIN_MEMORY_SIZE } from "../constants/server";

export const useServerComposerForm = () => {
  const [formInputs, setFormInputs] = useState<ServerComposerFormInputs>({
    cpu: "",
    memorySize: undefined,
    isGpuAccelerated: false
  });

  const [errors, setErrors] = useState<ServerComposerFormErrors>({
    memoryError: "",
    submitError: ""
  });

  const handleMemoryChange = (inputValue: string) => {
    const numberValue = inputValue === "" ? undefined : parseInt(inputValue.replace(/,/g, ""), 10);
    setFormInputs((prev) => ({...prev, memorySize: numberValue}));

    if (!inputValue) {
      setErrors((prev) => ({...prev, memoryError: ""}));
      return;
    }

    const numericValue = inputValue.replace(/,/g, ""); // Remove commas for validation

    const value = parseInt(numericValue, 10);

    if (isNaN(value)) {
      setErrors((prev) => ({...prev, memoryError: ERROR_MESSAGES.INVALID_NUMBER}));
      return;
    }

    if (value < MIN_MEMORY_SIZE || value > MAX_MEMORY_SIZE) {
      setErrors((prev) => ({...prev, memoryError: ERROR_MESSAGES.MEMORY_RANGE}));
      return;
    }

    if (value % MEMORY_SIZE_MULTIPLE !== 0) {
      setErrors((prev) => ({...prev, memoryError: ERROR_MESSAGES.MEMORY_MULTIPLE}));
      return;
    }

    if (!isPowerOfTwo(value / MEMORY_SIZE_MULTIPLE)) {
      setErrors((prev) => ({...prev, memoryError: ERROR_MESSAGES.POWER_OF_TWO}));
      return;
    }

    setErrors((prev) => ({...prev, memoryError: ""}));
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
    const fieldName = e.target.name;

    switch(fieldName) {
      case "memory-size-input":
        handleMemoryChange(e.target.value);
        break;
      case "cpu-select":
        setFormInputs((prev) => ({...prev, cpu: e.target.value}));
        break;
      case "is-gpu-accelerated-checkbox":
        const value = !formInputs.isGpuAccelerated;
        setFormInputs((prev) => ({...prev, isGpuAccelerated: value}))
        break;
      default:
        console.log("Unhandled field. Handle error here");
    }
  }

  const validateForm = (): boolean => {
    if (formInputs.cpu === "") {
      setErrors((prev) => ({...prev, submitError: "Please select a CPU"}));
      return false;
    }
    
    if (errors.memoryError || formInputs.memorySize === undefined) {
      setErrors((prev) => ({...prev, submitError: "Please enter a valid memory size"}));
      return false;
    }
    
    setErrors((prev) => ({...prev, submitError: ""}));
    return true;
  }

  return {
    formInputs,
    errors,
    handleInputChange,
    validateForm
  };
}