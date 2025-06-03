import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddGrocery from "./AddGrocery";
import axios from "axios";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@testing-library/jest-dom";

jest.mock("axios");

const renderWithQueryClient = (ui) => {
  const queryClient = new QueryClient();
  render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
};

describe("AddGrocery Component", () => {
  const mockGroceryData = {
    data: [
      { id: 1, name: "Apple", price: "2", image: "apple.jpg" },
      { id: 2, name: "Banana", price: "1", image: "banana.jpg" },
    ],
  };
  const mockAddGroceryResponse = {
    data: {
      id: mockGroceryData.data.length + 1,
      name: "Orange",
      price: "3",
      image: "orange.jpg",
    },
  };
  beforeEach(() => {
    jest.clearAllMocks(); // ✅ Clear mocks before each test
    axios.get.mockResolvedValueOnce(mockGroceryData);
  });

  test("render grocery item", async () => {
    renderWithQueryClient(<AddGrocery />);

    expect(await screen.getByText("Loading...")).toBeInTheDocument();

    const items = await screen.findAllByTitle("Grocery Item");
    expect(items).toHaveLength(mockGroceryData.data.length);

    // Wait for the grocery items to be fetched and rendered

    const appleItem = await screen.findByText("Apple");
    const bananaItem = await screen.findByText("Banana");
    const groceryNames = screen.getAllByTitle("grocery name");

    // We can Check if the grocery items are rendered
    expect(appleItem).toBeInTheDocument();
    expect(bananaItem).toBeInTheDocument();

    // OR

    //We can Check if the grocery names are rendered correctly
    expect(groceryNames[0]).toHaveTextContent("Apple");
    expect(groceryNames[1]).toHaveTextContent("Banana");
  });

  test("add new grocery item", async () => {
    await axios.post.mockResolvedValueOnce(mockAddGroceryResponse); // ✅ also before render

    // // After post, re-fetch updated list including Orange
    await axios.get.mockResolvedValueOnce({
      data: [...mockGroceryData.data, mockAddGroceryResponse.data],
    });

    renderWithQueryClient(<AddGrocery />);

    await screen.findAllByTitle("Grocery Item"); //use findBy to wait for the items to be rendered

    const groceryNameInput = screen.getByPlaceholderText("Grocery name");
    const groceryPriceInput = screen.getByPlaceholderText("Price");
    const groceryImageInput = screen.getByPlaceholderText("Image url");

    fireEvent.change(groceryNameInput, {
      target: { value: "Orange", name: "name" },
    });
    fireEvent.change(groceryPriceInput, {
      target: { value: "3", name: "price" },
    });
    fireEvent.change(groceryImageInput, {
      target: { value: "orange.jpg", name: "image" },
    });

    fireEvent.click(screen.getByTitle("submit item"));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith("http://localhost:8080/grocery", {
        id: mockGroceryData.data.length + 1,
        name: "Orange",
        price: "3",
        image: "orange.jpg",
      });
      expect(screen.getByText("Orange")).toBeInTheDocument();
      expect(screen.getByText("$3/kg")).toBeInTheDocument();
      expect(screen.getByAltText("orange.jpg")).toBeInTheDocument();

      //   All input fields should be cleared after adding a grocery item
      expect(groceryNameInput).toHaveValue("");
      expect(groceryPriceInput).toHaveValue("");
      expect(groceryImageInput).toHaveValue("");
    });
  });
});
