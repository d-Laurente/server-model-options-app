import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ServerOptionsDisplay from "../ServerOptionsDisplay";

describe("ServerOptionsDisplay Component", () => {
  test("renders the component with title", () => {
    render(<ServerOptionsDisplay serverOptions={[]} />);
    expect(screen.getByText("Server Model Options")).toBeInTheDocument();
  });

  test("displays 'No options available' when serverOptions is empty", () => {
    render(<ServerOptionsDisplay serverOptions={[]} />);
    expect(screen.getByText("No options available")).toBeInTheDocument();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  test("renders a list of server options when provided", () => {
    const options = ["Tower Server", "4U Rack Server", "High Density Server"];
    render(<ServerOptionsDisplay serverOptions={options} />);
    
    // Check that the list exists
    const list = screen.getByRole("list");
    expect(list).toBeInTheDocument();
    
    // Check that all options are displayed
    options.forEach(option => {
      expect(screen.getByText(option)).toBeInTheDocument();
    });
    
    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(options.length);
  });

  test("renders each option with the correct key", () => {
    const options = ["Tower Server", "4U Rack Server"];
    const { container, debug } = render(<ServerOptionsDisplay serverOptions={options} />);
    const listItems = screen.getAllByRole("listitem");
    expect(listItems[0]).toHaveTextContent("Tower Server");
    expect(listItems[1]).toHaveTextContent("4U Rack Server");
  });
});
