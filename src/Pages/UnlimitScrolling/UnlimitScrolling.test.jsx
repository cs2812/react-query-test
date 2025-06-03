import React from "react";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import UnlimitScrolling from "./UnlimitScrolling";
import "@testing-library/jest-dom";

// Mock axios
jest.mock("axios");

// ✅ Mock IntersectionObserver
window.IntersectionObserver = class {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {
    this.callback([{ isIntersecting: true }]);
  }
  unobserve() {}
  disconnect() {}
};

// ✅ React Query + Router provider helper
const renderWithProviders = (ui) => {
  const testQueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <MemoryRouter>
      <QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>
    </MemoryRouter>
  );
};

// ✅ Mock Data
const mockUserPage1 = {
  data: {
    page: 1,
    total_pages: 2,
    data: [
      {
        id: 1,
        email: "george.bluth@reqres.in",
        first_name: "George",
        last_name: "Bluth",
        avatar: "https://reqres.in/img/faces/1-image.jpg",
      },
      {
        id: 2,
        email: "janet.weaver@reqres.in",
        first_name: "Janet",
        last_name: "Weaver",
        avatar: "https://reqres.in/img/faces/2-image.jpg",
      },
    ],
  },
};

describe("UnlimitScrolling Component", () => {
  test("renders user cards after loading", async () => {
    axios.get.mockResolvedValueOnce(mockUserPage1);

    renderWithProviders(<UnlimitScrolling />);

    // ✅ Check using getByText, which now works within MemoryRouter
    expect(await screen.findByText("George Bluth")).toBeInTheDocument();
    expect(await screen.findByText("Janet Weaver")).toBeInTheDocument();

    expect(screen.getByText("End of Page")).toBeInTheDocument();
  });

  test("renders error state", async () => {
    axios.get.mockRejectedValueOnce(new Error("Failed to fetch users"));

    renderWithProviders(<UnlimitScrolling />);

    expect(
      await screen.findByText("Failed to fetch users")
    ).toBeInTheDocument();
  });
});
