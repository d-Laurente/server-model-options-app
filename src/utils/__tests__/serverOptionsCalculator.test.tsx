import { determineServerOptions } from "../serverOptionsCalculator";
import { ServerComposerFormInputs } from "../../types/server";
import { 
  MIN_MEMORY_SIZE,
  MAX_MEMORY_SIZE,
  MEMORY_SIZE_MULTIPLE,
  HIGH_DENSITY_THRESHOLD,
  RACK_SERVER_THRESHOLD,
  BASIC_SERVER_THRESHOLD,
  SERVER_TYPES
} from "../../constants/server";

describe("Tests determineServerOptions all combinations", () => {
  describe("Tests for High Density Server", () => {
    test.each([
      { cpu: "ARM", memorySize: HIGH_DENSITY_THRESHOLD, isGpuAccelerated: true },
      { cpu: "ARM", memorySize: HIGH_DENSITY_THRESHOLD + (MAX_MEMORY_SIZE - HIGH_DENSITY_THRESHOLD) / 2 , isGpuAccelerated: true },
      { cpu: "ARM", memorySize: MAX_MEMORY_SIZE, isGpuAccelerated: true },
    ])("Inputs = %p are VALID high density server options", (input) => {
      const output = determineServerOptions(input);
      expect(output).toEqual([SERVER_TYPES.HIGH_DENSITY]);
    });
  
    test.each([
      { cpu: "ARM", memorySize: HIGH_DENSITY_THRESHOLD, isGpuAccelerated: false },
      { cpu: "ARM", memorySize: HIGH_DENSITY_THRESHOLD - MEMORY_SIZE_MULTIPLE, isGpuAccelerated: true },
      { cpu: "X86", memorySize: HIGH_DENSITY_THRESHOLD, isGpuAccelerated: true },
      { cpu: "Power", memorySize: HIGH_DENSITY_THRESHOLD, isGpuAccelerated: true },
    ])("Inputs = %p are INVALID high density server options", (input) => {
      const output = determineServerOptions(input);
      expect(output).not.toContain(SERVER_TYPES.HIGH_DENSITY);
    });
  });

  describe("Tests for Mainframe", () => {
    test.each([
      { cpu: "Power", memorySize: HIGH_DENSITY_THRESHOLD, isGpuAccelerated: false },
      { cpu: "Power", memorySize: HIGH_DENSITY_THRESHOLD, isGpuAccelerated: true },
      { cpu: "Power", memorySize: BASIC_SERVER_THRESHOLD, isGpuAccelerated: false },
      { cpu: "Power", memorySize: MAX_MEMORY_SIZE, isGpuAccelerated: false },
    ])("Inputs = %p are VALID Mainframe server options", (input) => {
      const output = determineServerOptions(input);
      expect(output).toContain(SERVER_TYPES.MAINFRAME);
    });
  
    test.each([
      { cpu: "ARM", memorySize: HIGH_DENSITY_THRESHOLD, isGpuAccelerated: false },
      { cpu: "X86", memorySize: HIGH_DENSITY_THRESHOLD, isGpuAccelerated: true },
      { cpu: "Power", memorySize: BASIC_SERVER_THRESHOLD - MEMORY_SIZE_MULTIPLE, isGpuAccelerated: true },
    ])("Inputs = %p are INVALID Mainframe server options", (input) => {
      const output = determineServerOptions(input);
      expect(output).not.toContain(SERVER_TYPES.MAINFRAME);
    });
  });

  describe("Tests for 4U Rack server", () => {
    test.each([
      { cpu: "Power", memorySize: HIGH_DENSITY_THRESHOLD, isGpuAccelerated: true },
      { cpu: "Power", memorySize: RACK_SERVER_THRESHOLD, isGpuAccelerated: false },
      { cpu: "X86", memorySize: HIGH_DENSITY_THRESHOLD, isGpuAccelerated: false },
      { cpu: "X86", memorySize: RACK_SERVER_THRESHOLD, isGpuAccelerated: false },
      { cpu: "ARM", memorySize: RACK_SERVER_THRESHOLD, isGpuAccelerated: true },
    ])("Inputs = %p are VALID 4U Rack server options", (input) => {
      const output = determineServerOptions(input);
      expect(output).toContain(SERVER_TYPES.RACK);
    });
  
    test.each([
      { cpu: "ARM", memorySize: HIGH_DENSITY_THRESHOLD, isGpuAccelerated: true },
      { cpu: "ARM", memorySize: RACK_SERVER_THRESHOLD - MEMORY_SIZE_MULTIPLE, isGpuAccelerated: true },
      { cpu: "X86", memorySize: RACK_SERVER_THRESHOLD - MEMORY_SIZE_MULTIPLE, isGpuAccelerated: true },
      { cpu: "Power", memorySize: RACK_SERVER_THRESHOLD - MEMORY_SIZE_MULTIPLE, isGpuAccelerated: true },
    ])("Inputs = %p are INVALID 4U Rack server options", (input) => {
      const output = determineServerOptions(input);
      expect(output).not.toContain(SERVER_TYPES.RACK);
    });
  });

  describe("Tests for Tower Server", () => {
    test.each([
      { cpu: "Power", memorySize: HIGH_DENSITY_THRESHOLD, isGpuAccelerated: true },
      { cpu: "Power", memorySize: RACK_SERVER_THRESHOLD, isGpuAccelerated: false },
      { cpu: "X86", memorySize: HIGH_DENSITY_THRESHOLD, isGpuAccelerated: false },
      { cpu: "X86", memorySize: RACK_SERVER_THRESHOLD, isGpuAccelerated: false },
      { cpu: "ARM", memorySize: RACK_SERVER_THRESHOLD, isGpuAccelerated: true },
      { cpu: "ARM", memorySize: RACK_SERVER_THRESHOLD - MEMORY_SIZE_MULTIPLE, isGpuAccelerated: true },
      { cpu: "X86", memorySize: RACK_SERVER_THRESHOLD - MEMORY_SIZE_MULTIPLE, isGpuAccelerated: true },
      { cpu: "Power", memorySize: RACK_SERVER_THRESHOLD - MEMORY_SIZE_MULTIPLE, isGpuAccelerated: true },
    ])("Inputs = %p are VALID Tower server options", (input) => {
      const output = determineServerOptions(input);
      expect(output).toContain(SERVER_TYPES.TOWER);
    });
  
    test.each([
      { cpu: "ARM", memorySize: BASIC_SERVER_THRESHOLD - MEMORY_SIZE_MULTIPLE, isGpuAccelerated: false },
      { cpu: "X86", memorySize: BASIC_SERVER_THRESHOLD - MEMORY_SIZE_MULTIPLE, isGpuAccelerated: true },
      { cpu: "Power", memorySize: BASIC_SERVER_THRESHOLD - MEMORY_SIZE_MULTIPLE, isGpuAccelerated: true },
    ])("Inputs = %p are INVALID Tower server options", (input) => {
      const output = determineServerOptions(input);
      expect(output).not.toContain(SERVER_TYPES.TOWER);
    });
  });

  describe("Tests for Combinations", () => {
    test.each([
      [{ cpu: "Power", memorySize: HIGH_DENSITY_THRESHOLD, isGpuAccelerated: false }, [SERVER_TYPES.MAINFRAME, SERVER_TYPES.TOWER, SERVER_TYPES.RACK]],
      [{ cpu: "Power", memorySize: RACK_SERVER_THRESHOLD - MEMORY_SIZE_MULTIPLE, isGpuAccelerated: false }, [SERVER_TYPES.MAINFRAME, SERVER_TYPES.TOWER]],
      [{ cpu: "Power", memorySize: BASIC_SERVER_THRESHOLD, isGpuAccelerated: false }, [SERVER_TYPES.MAINFRAME, SERVER_TYPES.TOWER]],
      [{ cpu: "ARM", memorySize: HIGH_DENSITY_THRESHOLD, isGpuAccelerated: true }, [SERVER_TYPES.HIGH_DENSITY]],
      [{ cpu: "ARM", memorySize: HIGH_DENSITY_THRESHOLD, isGpuAccelerated: false }, [SERVER_TYPES.TOWER, SERVER_TYPES.RACK]],
      [{ cpu: "ARM", memorySize: RACK_SERVER_THRESHOLD + MEMORY_SIZE_MULTIPLE, isGpuAccelerated: true }, [SERVER_TYPES.TOWER, SERVER_TYPES.RACK]],
      [{ cpu: "X86", memorySize: RACK_SERVER_THRESHOLD, isGpuAccelerated: true }, [SERVER_TYPES.TOWER, SERVER_TYPES.RACK]],
      [{ cpu: "X86", memorySize: RACK_SERVER_THRESHOLD - MEMORY_SIZE_MULTIPLE, isGpuAccelerated: true }, [SERVER_TYPES.TOWER]],

    ])("Inputs = %p are VALID combinations", (input, expected_output) => {
      const output = determineServerOptions(input);
      expect(output).toEqual(expected_output);
    });

  });

  describe("Tests for No Options", () => {
    test.each([
      { cpu: "Power", memorySize: BASIC_SERVER_THRESHOLD - MEMORY_SIZE_MULTIPLE, isGpuAccelerated: false },
      { cpu: "X86", memorySize: BASIC_SERVER_THRESHOLD - MEMORY_SIZE_MULTIPLE, isGpuAccelerated: true },
    ])("Inputs = %p are VALID Mainfram server options", (input) => {
      const output = determineServerOptions(input);
      expect(output).toEqual([]);
    });
  });
});
