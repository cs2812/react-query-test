import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Navbar from "./Navbar";

// Dummy component to confirm navigation
const DummyComponent = ({ text }) => <div>{text}</div>;

const renderWithRouter = (ui, initialEntries = ["/"]) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/" element={<DummyComponent text="Home Page" />} />
        <Route
          path="/add-grocery"
          element={<DummyComponent text="Add Grocery Page" />}
        />
        <Route
          path="/rq-fetch"
          element={<DummyComponent text="React Query Page" />}
        />
        <Route
          path="/unlimit-scrolling"
          element={<DummyComponent text="Unlimit Scrolling Page" />}
        />
      </Routes>
      {ui}
    </MemoryRouter>
  );
};

describe("Navbar Component", () => {
  test("renders logo and dropdown", () => {
    renderWithRouter(<Navbar />);
    expect(screen.getByText("Learn React Query")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });
  test("check dropdown", () => {
    renderWithRouter(<Navbar />);
    const options = screen.getAllByRole("option");
    const labels = options.map((ele) => ele.textContent);
    expect(labels).toEqual([
      "Home",
      "Add Grocery",
      "React Query",
      "Unlimit Scrolling",
    ]);
  });
  test("navigates to Add Grocery when selected", () => {
    renderWithRouter(<Navbar />);
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "/add-grocery" },
    });
    expect(screen.getByText("Add Grocery Page")).toBeInTheDocument();
  });

  test("navigates to React Query when selected", () => {
    renderWithRouter(<Navbar />);
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "/rq-fetch" },
    });
    expect(screen.getByText("React Query Page")).toBeInTheDocument();
  });
});
