import { fireEvent, render, screen,waitFor } from "@testing-library/react";
import RQFetch from "./RQFetch";
import axios from "axios";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@testing-library/jest-dom";

jest.mock("axios");

const renderWithClient = (ui) => {
  const testQueryClient = new QueryClient();
  return render(
    <QueryClientProvider client={testQueryClient}>
      <BrowserRouter>{ui}</BrowserRouter>
    </QueryClientProvider>
  );
};
const mockUserData = {
  data: {
    data: [
      {
        id: 1,
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@example.com",
        avatar: "https://reqres.in/img/faces/1-image.jpg",
      },
      {
        id: 2,
        first_name: "Jane",
        last_name: "Smith",
        email: "jane.smith@example.com",
        avatar: "https://reqres.in/img/faces/2-image.jpg",
      },
    ],
    total_pages: 2,
  },
};
describe("RQFetch Component", () => {
  test("renders loading initially", async () => {
    axios.get.mockResolvedValueOnce(mockUserData);
    renderWithClient(<RQFetch />);
    expect(screen.getByText("...Loading")).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByTestId("user-card-1")).toBeInTheDocument()
    );
  });

  test("renders user cards", async () => {
    axios.get.mockResolvedValue(mockUserData);
    renderWithClient(<RQFetch />);

    await waitFor(() => {
      expect(screen.getByTestId("user-card-1")).toBeInTheDocument();
      expect(screen.getByTestId("user-card-2")).toBeInTheDocument();
    });
  });
  test("refetch on button click", async () => {
    axios.get.mockResolvedValue(mockUserData);
    renderWithClient(<RQFetch />);
    const refetchButton = await screen.findByTestId("refetch-button");

    await waitFor(() =>
      expect(screen.getByTestId("user-card-1")).toBeInTheDocument()
    );

    fireEvent.click(refetchButton);
    expect(axios.get).toHaveBeenCalledTimes(2); // Initial + Refetch
  });
});
