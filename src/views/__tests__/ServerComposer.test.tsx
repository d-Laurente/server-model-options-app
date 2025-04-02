import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ServerComposer from "../ServerComposer/ServerComposer";
import { useServerComposerForm } from "../../hooks/useServerComposerForm";
import { determineServerOptions } from "../../utils/serverOptionsCalculator";

// Mock the dependencies
jest.mock("../../hooks/useServerComposerForm");
jest.mock("../../utils/serverOptionsCalculator");
jest.mock("../../components/ServerComposerForm", () => ({
  __esModule: true,
  default: ({ formInputs, errors, onChange, onSubmit }: any) => (
    <form data-testid="server-composer-form" onSubmit={onSubmit}>
      <button type="submit">Submit</button>
    </form>
  )
}));
jest.mock("../../components/ServerOptionsDisplay", () => ({
  __esModule: true,
  default: ({ serverOptions }: any) => (
    <div data-testid="server-options-display">
      {serverOptions.map((option: string, index: number) => (
        <div key={index} data-testid={`server-option-${index}`}>{option}</div>
      ))}
    </div>
  )
}));

describe("ServerComposer Component", () => {
  // Mock implementation setup
  const mockFormInputs = {
    cpu: "ARM",
    memorySize: 2048,
    isGpuAccelerated: false
  };
  
  const mockErrors = {
    memoryError: "",
    submitError: ""
  };
  
  const mockHandleInputChange = jest.fn();
  const mockValidateForm = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup mock return values
    (useServerComposerForm as jest.Mock).mockReturnValue({
      formInputs: mockFormInputs,
      errors: mockErrors,
      handleInputChange: mockHandleInputChange,
      validateForm: mockValidateForm
    });
    
    // Default behavior for determineServerOptions
    (determineServerOptions as jest.Mock).mockReturnValue(["Tower Server"]);
  });
  
  test("renders the component with correct title", () => {
    render(<ServerComposer />);
    expect(screen.getByText("Server Composer")).toBeInTheDocument();
  });
  
  test("renders ServerComposerForm with correct props", () => {
    render(<ServerComposer />);
    
    const form = screen.getByTestId("server-composer-form");
    expect(form).toBeInTheDocument();
  });
  
  test("does not render ServerOptionsDisplay initially", () => {
    render(<ServerComposer />);
    
    expect(screen.queryByTestId("server-options-display")).not.toBeInTheDocument();
  });
  
  test("shows ServerOptionsDisplay after form submission", async () => {
    // Mock validateForm to return true
    mockValidateForm.mockReturnValue(true);
    
    render(<ServerComposer />);
    
    const form = screen.getByTestId("server-composer-form");
    fireEvent.submit(form);
    
    // Check that validateForm was called
    expect(mockValidateForm).toHaveBeenCalledTimes(1);
    
    // Check that determineServerOptions was called with the correct inputs
    expect(determineServerOptions).toHaveBeenCalledWith(mockFormInputs);
    
    // Check that ServerOptionsDisplay is now shown
    expect(screen.getByTestId("server-options-display")).toBeInTheDocument();
    
    // Check that it displays the correct options
    expect(screen.getByTestId("server-option-0")).toHaveTextContent("Tower Server");
  });
  
  test("does not call determineServerOptions when form validation fails", () => {
    // Mock validateForm to return false
    mockValidateForm.mockReturnValue(false);
    
    render(<ServerComposer />);
    
    const form = screen.getByTestId("server-composer-form");
    fireEvent.submit(form);
    
    // Check that validateForm was called
    expect(mockValidateForm).toHaveBeenCalledTimes(1);
    
    // Check that determineServerOptions was NOT called
    expect(determineServerOptions).not.toHaveBeenCalled();
    
    // ServerOptionsDisplay should still be shown (isSubmit is still set to true)
    // but with empty options
    expect(screen.getByTestId("server-options-display")).toBeInTheDocument();
    expect(screen.queryByTestId("server-option-0")).not.toBeInTheDocument();
  });
  
  test("displays multiple server options when available", () => {
    // Mock validateForm to return true
    mockValidateForm.mockReturnValue(true);
    
    // Mock determineServerOptions to return multiple values
    (determineServerOptions as jest.Mock).mockReturnValue(["Tower Server", "4U Rack Server", "Mainframe"]);
    
    render(<ServerComposer />);
    
    const form = screen.getByTestId("server-composer-form");
    fireEvent.submit(form);
    
    // Check that all options are displayed
    expect(screen.getByTestId("server-option-0")).toHaveTextContent("Tower Server");
    expect(screen.getByTestId("server-option-1")).toHaveTextContent("4U Rack Server");
    expect(screen.getByTestId("server-option-2")).toHaveTextContent("Mainframe");
  });
  
  test("handles empty server options correctly", () => {
    // Mock validateForm to return true
    mockValidateForm.mockReturnValue(true);
    
    // Mock determineServerOptions to return empty array
    (determineServerOptions as jest.Mock).mockReturnValue([]);
    
    render(<ServerComposer />);
    
    const form = screen.getByTestId("server-composer-form");
    fireEvent.submit(form);
    
    // ServerOptionsDisplay should be shown but with no options
    expect(screen.getByTestId("server-options-display")).toBeInTheDocument();
    expect(screen.queryByTestId("server-option-0")).not.toBeInTheDocument();
  });
});