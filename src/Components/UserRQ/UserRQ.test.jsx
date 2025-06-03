import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import axios from "axios";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UserRQ from "./UserRQ";

jest.mock("axios");
const mockUserData = {
  data: {
    data: {
      id: 1,
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@example.com",
      avatar: "https://reqres.in/img/faces/1-image.jpg",
    },
  },
};
const renderWithClient = (ui, { route = "/user/1" } = {}) => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/user/:userId" element={ui} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
};
describe("UserRQ Component", () => {
  test("renders loading state", () => {
    axios.get.mockReturnValue(new Promise(() => {})); // never resolves
    renderWithClient(<UserRQ />);
    // "i" used for case-insensitive matching
    expect(screen.getByText(/loading.../i)).toBeInTheDocument();
  });

  test("renders error state", async () => {
    axios.get.mockRejectedValue(new Error("Failed to fetch user"));
    renderWithClient(<UserRQ />);
    expect(
      await screen.findByText(/failed to fetch user/i)
    ).toBeInTheDocument();
  });

  test("renders user data", async () => {
    axios.get.mockResolvedValue(mockUserData);
    renderWithClient(<UserRQ />);

    await waitFor(() => {
      expect(screen.getByTestId("user-data")).toBeInTheDocument();
    });

    expect(screen.getByTestId("user-name-1")).toHaveTextContent("John Doe");
    expect(screen.getByTestId("user-email-1")).toHaveTextContent(
      "john.doe@example.com"
    );
    // "i" used for case-insensitive matching
    expect(screen.getByAltText(/user-img-1/i)).toHaveAttribute(
      "src",
      mockUserData.data.data.avatar
    );
  });
});
