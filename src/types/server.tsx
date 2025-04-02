// Type definitions for server composer

export interface ServerComposerFormInputs {
  cpu: string;
  memorySize: number | undefined;
  isGpuAccelerated: boolean;
}

export interface ServerComposerFormErrors {
  memoryError: string;
  submitError: string;
}

// CPU options
export type CpuOption = "X86" | "Power" | "ARM";
export const CPU_OPTIONS: Array<CpuOption> = ["X86", "Power", "ARM"];

// Server model types
export type ServerModel = "High Density Server" | "Tower Server" | "4U Rack Server" | "Mainframe";