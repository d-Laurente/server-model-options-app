import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ServerComposerForm from "../ServerComposerForm";
import { ServerComposerFormInputs, ServerComposerFormErrors } from "../../types/server";

// Mock the child components for isolation
jest.mock('../CpuSelectDropdown', () => ({
  __esModule: true,
  default: ({ cpu, cpuOptions, onChange, sx }: any) => (
    <div data-testid="cpu-select-dropdown">
      <select 
        data-testid="cpu-select" 
        name="cpu-select" 
        value={cpu}
        onChange={onChange}
        aria-label="CPU"
      >
        <option value="">Select CPU</option>
        {cpuOptions.map((option: string) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  )
}));

jest.mock('../MemoryInput', () => ({
  __esModule: true,
  default: ({ memorySize, memoryFieldHelperText, onChange, sx }: any) => (
    <div data-testid="memory-input-component">
      <input 
        data-testid="memory-input" 
        name="memory-size-input"
        value={memorySize || ''}
        onChange={onChange}
        aria-label="Memory"
      />
      {memoryFieldHelperText && (
        <span data-testid="memory-error">{memoryFieldHelperText}</span>
      )}
    </div>
  )
}));

describe("ServerComposerForm Component", () => {
  // Default props for testing
  const defaultProps = {
    formInputs: {
      cpu: "",
      memorySize: undefined,
      isGpuAccelerated: false
    } as ServerComposerFormInputs,
    errors: {
      memoryError: "",
      submitError: ""
    } as ServerComposerFormErrors,
    onChange: jest.fn(),
    onSubmit: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the form with all required components", () => {
    render(<ServerComposerForm {...defaultProps} />);
    
    // Check for all major components
    expect(screen.getByTestId('cpu-select-dropdown')).toBeInTheDocument();
    expect(screen.getByTestId('memory-input-component')).toBeInTheDocument();
    expect(screen.getByLabelText('GPU Accelerated Card')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  test("passes correct props to child components", () => {
    const customProps = {
      ...defaultProps,
      formInputs: {
        cpu: "ARM",
        memorySize: 2048,
        isGpuAccelerated: true
      }
    };
    render(<ServerComposerForm {...customProps} />);

    const cpuSelect = screen.getByTestId('cpu-select'); 
    expect(cpuSelect).toHaveValue('ARM');
    
    // Check MemoryInput receives correct memory value
    const memoryInput = screen.getByTestId('memory-input');
    expect(memoryInput).toHaveValue('2048');
    
    // Check Checkbox is checked
    const checkbox = screen.getByLabelText('GPU Accelerated Card');
    expect(checkbox).toBeChecked();
  });

  test("passes error messages to MemoryInput", () => {
    const propsWithError = {
      ...defaultProps,
      errors: {
        memoryError: "Invalid memory size",
        submitError: ""
      }
    };
    
    render(<ServerComposerForm {...propsWithError} />);
    
    // Check error message is displayed
    expect(screen.findAllByText("Invalid memory size"));
  });

  test("calls onChange when CPU selection changes", () => {
    render(<ServerComposerForm {...defaultProps} />);
    
    const cpuSelect = screen.getByLabelText(/CPU/i);
    fireEvent.change(cpuSelect, { target: { value: "ARM" } });
    
    expect(defaultProps.onChange).toHaveBeenCalledTimes(1);
  });

  test("calls onChange when memory input changes", () => {
    render(<ServerComposerForm {...defaultProps} />);
    
    const memoryInput = screen.getByTestId('memory-input');
    fireEvent.change(memoryInput, { target: { value: '2048' } });
    
    expect(defaultProps.onChange).toHaveBeenCalledTimes(1);
  });

  test("calls onChange when GPU checkbox is toggled", () => {
    render(<ServerComposerForm {...defaultProps} />);
    
    const checkbox = screen.getByLabelText("GPU Accelerated Card");
    fireEvent.click(checkbox);
    
    expect(defaultProps.onChange).toHaveBeenCalledTimes(1);
  });

  test("calls onSubmit when form is submitted", () => {
    const { container } = render(<ServerComposerForm {...defaultProps} />);
    const form = container.querySelector('form') || container.firstChild;
    fireEvent.submit(form);
    
    expect(defaultProps.onSubmit).toHaveBeenCalledTimes(1);
  });
});