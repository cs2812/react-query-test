import React from "react";

const buttonStyle = {
  padding: "6px 12px",
  margin: "0 4px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  backgroundColor: "#f2f2f2",
  cursor: "pointer",
};

const activeButtonStyle = {
  ...buttonStyle,
  backgroundColor: "#007bff",
  color: "#fff",
  fontWeight: "bold",
};

const disabledButtonStyle = {
  ...buttonStyle,
  backgroundColor: "#e0e0e0",
  color: "#999",
  cursor: "not-allowed",
};
const Pagination = ({ totalPages, currentPage, onPageChange, refetch }) => {
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  return (
    <div
      style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
    >
      <button
        style={currentPage === 1 ? disabledButtonStyle : buttonStyle}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        data-testid="prev-button"
      >
        Prev
      </button>

      {pageNumbers.map((num) => (
        <button
          key={num}
          style={num === currentPage ? activeButtonStyle : buttonStyle}
          onClick={() => onPageChange(num)}
          data-testid={`page-button-${num}`}
        >
          {num}
        </button>
      ))}

      <button
        style={currentPage === totalPages ? disabledButtonStyle : buttonStyle}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        data-testid="next-button"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
