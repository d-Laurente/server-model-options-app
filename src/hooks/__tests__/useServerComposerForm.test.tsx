import { renderHook, act } from "@testing-library/react";
import { SelectChangeEvent } from "@mui/material/Select";
import { useServerComposerForm } from "../useServerComposerForm";
import { ERROR_MESSAGES, MIN_MEMORY_SIZE, MAX_MEMORY_SIZE } from "../../constants/server";
import { isPowerOfTwo } from "../../utils/helpers";

describe("useServerComposerForm", () => {
  // Test initial state
  test("initializes with default values", () => {
    const { result } = renderHook(() => useServerComposerForm());
    
    expect(result.current.formInputs).toEqual({
      cpu: "",
      memorySize: undefined,
      isGpuAccelerated: false
    });
    
    expect(result.current.errors).toEqual({
      memoryError: "",
      submitError: ""
    });
  });
  
  // Test CPU selection
  test("updates CPU selection correctly", () => {
    const { result } = renderHook(() => useServerComposerForm());

    act(() => {
      const mockEvent = {
        target: {
          name: "cpu-select",
          value: "X86"
        }
      } as SelectChangeEvent;
      
      result.current.handleInputChange(mockEvent);
    });
    
    expect(result.current.formInputs.cpu).toBe("X86");
  });
  
  // Test GPU checkbox
  test("toggles GPU acceleration correctly", () => {
    const { result } = renderHook(() => useServerComposerForm());
    
    // Checks for toggle on
    act(() => {
      const mockToggleOnEvent = {
        target: {
          name: "is-gpu-accelerated-checkbox",
        }
      } as SelectChangeEvent;
      result.current.handleInputChange(mockToggleOnEvent);
    });
    expect(result.current.formInputs.isGpuAccelerated).toBe(true);
    
    // Checks for toggle off
    act(() => {
      const mockToggleOffEvent = {
        target: {
          name: "is-gpu-accelerated-checkbox",
        }
      } as SelectChangeEvent;
      result.current.handleInputChange(mockToggleOffEvent);
    });
    expect(result.current.formInputs.isGpuAccelerated).toBe(false);
  });
  
  // Test memory input validation
  describe("memory input validation", () => {
    test("handles empty input", () => {
      const { result } = renderHook(() => useServerComposerForm());
      
      act(() => {
        const mockEvent = {
          target: {
            name: "memory-size-input",
            value: ""
          }
        } as React.ChangeEvent<HTMLInputElement>;
        
        result.current.handleInputChange(mockEvent);
      });
      
      expect(result.current.formInputs.memorySize).toBeUndefined();
      expect(result.current.errors.memoryError).toBe("");
    });
    
    test("handles valid memory input", () => {
      const { result } = renderHook(() => useServerComposerForm());
      
      act(() => {
        const mockEvent = {
          target: {
            name: "memory-size-input",
            value: "2048"
          }
        } as React.ChangeEvent<HTMLInputElement>;
        
        result.current.handleInputChange(mockEvent);
      });
      
      expect(result.current.formInputs.memorySize).toBe(2048);
      expect(result.current.errors.memoryError).toBe("");
    });
    
    test("validates memory input with commas", () => {
      const { result } = renderHook(() => useServerComposerForm());
      
      act(() => {
        const mockEvent = {
          target: {
            name: "memory-size-input",
            value: "4,096"
          }
        } as React.ChangeEvent<HTMLInputElement>;
        
        result.current.handleInputChange(mockEvent);
      });
      
      expect(result.current.formInputs.memorySize).toBe(4096);
      expect(result.current.errors.memoryError).toBe("");
    });
    
    test("handles non-numeric input", () => {
      const { result } = renderHook(() => useServerComposerForm());
      
      act(() => {
        const mockEvent = {
          target: {
            name: "memory-size-input",
            value: "abc"
          }
        } as React.ChangeEvent<HTMLInputElement>;
        
        result.current.handleInputChange(mockEvent);
      });
      
      expect(result.current.errors.memoryError).toBe(ERROR_MESSAGES.INVALID_NUMBER);
    });
    
    test("validates memory below minimum", () => {
      const { result } = renderHook(() => useServerComposerForm());
      
      act(() => {
        const mockEvent = {
          target: {
            name: "memory-size-input",
            value: (MIN_MEMORY_SIZE - 1).toString()
          }
        } as React.ChangeEvent<HTMLInputElement>;
        
        result.current.handleInputChange(mockEvent);
      });
      
      expect(result.current.errors.memoryError).toBe(ERROR_MESSAGES.MEMORY_RANGE);
    });
    
    test("validates memory above maximum", () => {
      const { result } = renderHook(() => useServerComposerForm());
      
      act(() => {
        const mockEvent = {
          target: {
            name: "memory-size-input",
            value: (MAX_MEMORY_SIZE + 1).toString()
          }
        } as React.ChangeEvent<HTMLInputElement>;
        
        result.current.handleInputChange(mockEvent);
      });
      
      expect(result.current.errors.memoryError).toBe(ERROR_MESSAGES.MEMORY_RANGE);
    });
    
    test("validates memory multiple of 1024", () => {
      const { result } = renderHook(() => useServerComposerForm());
      
      act(() => {
        const mockEvent = {
          target: {
            name: "memory-size-input",
            value: "3000" // Not a multiple of 1024
          }
        } as React.ChangeEvent<HTMLInputElement>;
        
        result.current.handleInputChange(mockEvent);
      });
      
      expect(result.current.errors.memoryError).toBe(ERROR_MESSAGES.MEMORY_MULTIPLE);
    });
    
    test("validates memory divided by 1024 is power of two", () => {
      const { result } = renderHook(() => useServerComposerForm());
      
      act(() => {
        const mockEvent = {
          target: {
            name: "memory-size-input",
            value: "3072" // 3*1024, but 3 is not a power of 2
          }
        } as React.ChangeEvent<HTMLInputElement>;
        
        result.current.handleInputChange(mockEvent);
      });
      
      expect(result.current.errors.memoryError).toBe(ERROR_MESSAGES.POWER_OF_TWO);
    });
  });
  
  // Test form validation
  describe("form validation", () => {
    test("validates form with missing CPU", () => {
      const { result } = renderHook(() => useServerComposerForm());
      
      // Add valid memory but no CPU
      act(() => {
        const mockEvent = {
          target: {
            name: "memory-size-input",
            value: "2048"
          }
        } as React.ChangeEvent<HTMLInputElement>;
        
        result.current.handleInputChange(mockEvent);
      });
      
      // Validate form
      let isValid;
      act(() => {
        isValid = result.current.validateForm();
      });
      
      expect(isValid).toBe(false);
      expect(result.current.errors.submitError).toBe("Please select a CPU");
    });
    
    test("validates form with missing memory", () => {
      const { result } = renderHook(() => useServerComposerForm());
      
      // Add CPU but no memory
      act(() => {
        const mockEvent = {
          target: {
            name: "cpu-select",
            value: "ARM"
          }
        } as SelectChangeEvent;
        
        result.current.handleInputChange(mockEvent);
      });
      
      // Validate form
      let isValid;
      act(() => {
        isValid = result.current.validateForm();
      });
      
      expect(isValid).toBe(false);
      expect(result.current.errors.submitError).toBe("Please enter a valid memory size");
    });
    
    test("validates form with invalid memory", () => {
      const { result } = renderHook(() => useServerComposerForm());
      
      // Add CPU
      act(() => {
        const cpuEvent = {
          target: {
            name: "cpu-select",
            value: "ARM"
          }
        } as SelectChangeEvent;
        
        result.current.handleInputChange(cpuEvent);
      });
      
      // Add invalid memory
      act(() => {
        const memoryEvent = {
          target: {
            name: "memory-size-input",
            value: "1000" // Invalid memory (too small)
          }
        } as React.ChangeEvent<HTMLInputElement>;
        
        result.current.handleInputChange(memoryEvent);
      });
      
      // Validate form
      let isValid;
      act(() => {
        isValid = result.current.validateForm();
      });
      
      expect(isValid).toBe(false);
      expect(result.current.errors.submitError).toBe("Please enter a valid memory size");
    });
    
    test("validates valid form successfully", () => {
      const { result } = renderHook(() => useServerComposerForm());
      
      // Add CPU
      act(() => {
        const cpuEvent = {
          target: {
            name: "cpu-select",
            value: "ARM"
          }
        } as SelectChangeEvent;
        
        result.current.handleInputChange(cpuEvent);
      });
      
      // Add valid memory
      act(() => {
        const memoryEvent = {
          target: {
            name: "memory-size-input",
            value: "2048" // Valid memory
          }
        } as React.ChangeEvent<HTMLInputElement>;
        
        result.current.handleInputChange(memoryEvent);
      });
      
      // Validate form
      let isValid;
      act(() => {
        isValid = result.current.validateForm();
      });
      
      expect(isValid).toBe(true);
      expect(result.current.errors.submitError).toBe("");
    });
  });
  
  // Test unhandled field name
  test("handles unhandled field names gracefully", () => {
    const consoleSpy = jest.spyOn(console, "log");
    const { result } = renderHook(() => useServerComposerForm());
    
    act(() => {
      const mockEvent = {
        target: {
          name: "unknown-field",
          value: "something"
        }
      } as React.ChangeEvent<HTMLInputElement>;
      
      result.current.handleInputChange(mockEvent);
    });
    
    expect(consoleSpy).toHaveBeenCalledWith("Unhandled field. Handle error here");
    consoleSpy.mockRestore();
  });
});