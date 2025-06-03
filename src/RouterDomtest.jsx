import { render } from "@testing-library/react";
import { BrowserRouter, Link } from "react-router-dom";

test("renders Link from react-router-dom", () => {
  const { getByText } = render(
    <BrowserRouter>
      <Link to="/home">Go Home</Link>
    </BrowserRouter>
  );

  expect(getByText("Go Home")).toBeInTheDocument();
});