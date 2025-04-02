import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import MemoryInput from "../MemoryInput";
import { formatNumberWithCommas } from "../../utils/helpers";

describe("MemoryInput Component", () => {
  // Default props for most tests
  const defaultProps = {
    memorySize: 2048,
    memoryFieldHelperText: "",
    onChange: jest.fn(),
  };

  beforeEach(() => {
    // Clear mock function calls before each test
    jest.clearAllMocks();
  });

  test("renders with the correct label", () => {
    render(<MemoryInput {...defaultProps} />);
    
    expect(screen.getByLabelText(/Memory Size/i)).toBeInTheDocument();
  });

  test("displays the formatted value from props", () => {
    render(<MemoryInput {...defaultProps} memorySize={1024000} />);
    
    const input = screen.getByLabelText(/Memory Size/i) as HTMLInputElement;
    expect(input.value).toBe("1,024,000");
  });

  test("displays an empty string when memorySize is undefined", () => {
    render(<MemoryInput {...defaultProps} memorySize={undefined} />);
    
    const input = screen.getByLabelText(/Memory Size/i) as HTMLInputElement;
    expect(input.value).toBe("");
  });

  test("displays the helper text when provided", () => {
    const helperText = "Value must be a multiple of 1024";
    render(<MemoryInput {...defaultProps} memoryFieldHelperText={helperText} />);
    
    expect(screen.getByText(helperText)).toBeInTheDocument();
  });

  test("calls onChange handler when input changes", () => {
    // Render with a debugging container
    const { container, debug } = render(<MemoryInput {...defaultProps} />);
    
  
    // Try to select the input more specifically
    const input = container.querySelector('input[name="memory-size-input"]');
    expect(input).not.toBeNull(); // Make sure we found it
    
    // Fire the event directly on the input element
    if (input) {
      fireEvent.change(input, { target: { value: '4096' } });
    }
    
    expect(defaultProps.onChange).toHaveBeenCalledTimes(1);
  });

  test("input has the correct name attribute", () => {
    render(<MemoryInput {...defaultProps} />);
    
    const input = screen.getByLabelText(/Memory Size/i);
    expect(input).toHaveAttribute("name", "memory-size-input");
  });

  test("displays MB adornment", () => {
    render(<MemoryInput {...defaultProps} />);
    
    expect(screen.getByText("MB")).toBeInTheDocument();
  });
});
