
import { ServerComposerFormInputs } from "../types/server";
import {
  MIN_MEMORY_SIZE,
  MAX_MEMORY_SIZE,
  MEMORY_SIZE_MULTIPLE,
  HIGH_DENSITY_THRESHOLD,
  RACK_SERVER_THRESHOLD,
  BASIC_SERVER_THRESHOLD,
  SERVER_TYPES
} from "../constants/server";


export const determineServerOptions = (
  { cpu, memorySize, isGpuAccelerated }: ServerComposerFormInputs
): Array<string> => {
  if (!memorySize) {
    return [];
  }

  if (memorySize < MIN_MEMORY_SIZE || 
      memorySize > MAX_MEMORY_SIZE || 
      (memorySize % MEMORY_SIZE_MULTIPLE) !== 0) {
    return [];
  }
  
  if (isGpuAccelerated) {
    if (cpu === "ARM" && memorySize >= HIGH_DENSITY_THRESHOLD) {
      return [SERVER_TYPES.HIGH_DENSITY];
    } else {
      return [];
    }
  }
  
  const availableModels = [];
  if (cpu === "power" && memorySize >= BASIC_SERVER_THRESHOLD) {
    availableModels.push(SERVER_TYPES.MAINFRAME);
  }
  
  if (memorySize >= RACK_SERVER_THRESHOLD) {
    if (cpu === "ARM") {
      availableModels.push(SERVER_TYPES.TOWER, SERVER_TYPES.RACK);
    } else {
      availableModels.push(SERVER_TYPES.TOWER, SERVER_TYPES.RACK);
    }
  } else if (memorySize >= BASIC_SERVER_THRESHOLD) {
    availableModels.push(SERVER_TYPES.TOWER);
  }
  
  return availableModels;
};
