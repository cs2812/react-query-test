import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Pagination from "./Pagination";

describe("Pagination Component", () => {
  const setup = (currentPage = 1, totalPages = 3, onPageChange = jest.fn()) => {
    render(
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={onPageChange}
      />
    );
    return { onPageChange };
  };

  test("renders Prev and Next buttons", () => {
    setup();
    expect(screen.getByTestId("prev-button")).toBeInTheDocument();
    expect(screen.getByTestId("next-button")).toBeInTheDocument();
  });

  test("disables Prev on first page", () => {
    setup(1);
    expect(screen.getByTestId("prev-button")).toBeDisabled();
    expect(screen.getByTestId("next-button")).not.toBeDisabled();
  });

  test("disables Next on last page", () => {
    setup(3, 3);
    expect(screen.getByTestId("next-button")).toBeDisabled();
    expect(screen.getByTestId("prev-button")).not.toBeDisabled();
  });

  test("calls onPageChange with correct value", () => {
    const { onPageChange } = setup(2);
    fireEvent.click(screen.getByTestId("prev-button"));
    expect(onPageChange).toHaveBeenCalledWith(1);

    fireEvent.click(screen.getByTestId("next-button"));
    expect(onPageChange).toHaveBeenCalledWith(3);

    fireEvent.click(screen.getByTestId("page-button-2"));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });
});
