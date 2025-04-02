import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import CpuSelectDropdown from "../CpuSelectDropdown";
import { SelectChangeEvent } from "@mui/material";

describe("CpuSelectDropdown Component", () => {
  // Default props for most tests
  const defaultProps = {
    cpu: "",
    cpuOptions: ["X86", "ARM", "Power"],
    onChange: jest.fn()
  };

  beforeEach(() => {
    // Clear mock function calls before each test
    jest.clearAllMocks();
  });

  test("renders with the correct label", () => {
    render(<CpuSelectDropdown {...defaultProps} />);
    expect(screen.getByLabelText(/CPU/i)).toBeInTheDocument();
  });

  test("renders all CPU options", () => {
    const { container } = render(<CpuSelectDropdown {...defaultProps} />);
    
    // Open the dropdown to render the menu items
    const selectElement = screen.getByLabelText(/CPU/i);
    fireEvent.mouseDown(selectElement);
    
    // Check each option is rendered
    const options = defaultProps.cpuOptions;
    options.forEach(option => {
      expect(screen.getByText(option)).toBeInTheDocument();
    });
  });

  test("displays the selected CPU value", () => {
    render(<CpuSelectDropdown {...defaultProps} cpu="ARM" />);
    
    // MUI Select displays the selected value
    expect(screen.getByLabelText(/CPU/i)).toHaveTextContent("ARM");
  });

  test("applies custom sx prop to FormControl", () => {
    const customSx = { width: "250px", marginTop: "10px" };
    const { container } = render(<CpuSelectDropdown {...defaultProps} sx={customSx} />);
    
    // Check if the FormControl (first child) has the styles
    const formControl = container.firstChild;
    expect(formControl).toHaveStyle("width: 250px");
    expect(formControl).toHaveStyle("margin-top: 10px");
  });

  test("calls onChange when a new option is selected", () => {
    render(<CpuSelectDropdown {...defaultProps} />);
    
    // Open the dropdown
    const selectElement = screen.getByLabelText(/CPU/i);
    fireEvent.mouseDown(selectElement);
    
    // Select an option
    const option = screen.getByText("ARM");
    fireEvent.click(option);
    
    // Check onChange was called
    expect(defaultProps.onChange).toHaveBeenCalledTimes(1);
    
    // We can"t easily check the exact event object due to MUI"s implementation,
    // but we can verify the handler was called
  });

  test("has correct id attributes for accessibility", () => {
    render(<CpuSelectDropdown {...defaultProps} />);
    const select = screen.getByLabelText(/CPU/i);
    expect(select).toHaveAttribute("id", "select-cpu");
  });
});