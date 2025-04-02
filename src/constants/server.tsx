// Server-related constants

// Memory validation constants
export const MIN_MEMORY_SIZE = 2048;
export const MAX_MEMORY_SIZE = 8388608;
export const MEMORY_SIZE_MULTIPLE = 1024;

// Server type thresholds
export const HIGH_DENSITY_THRESHOLD = 524288;
export const RACK_SERVER_THRESHOLD = 131072;
export const BASIC_SERVER_THRESHOLD = 2048;

// Error messages
export const ERROR_MESSAGES = {
  INVALID_NUMBER: "Invalid input. Please enter a valid number",
  MEMORY_RANGE: "Value must be between 2,048 and 8,388,608",
  MEMORY_MULTIPLE: "Value must be a multiple of 1024",
  POWER_OF_TWO: "Value / 1024 must be a power of 2",
  NO_CPU: "Please select a CPU",
  INVALID_MEMORY: "Please enter a valid memory size",
};

// Server types
export const SERVER_TYPES = {
  HIGH_DENSITY: "High Density Server",
  TOWER: "Tower Server",
  RACK: "4U Rack Server",
  MAINFRAME: "Mainframe",
};