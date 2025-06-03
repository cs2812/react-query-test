import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "../styles.css"; // optional: for styling

const Navbar = () => {
  const navigate = useNavigate();
  const link = [
    { title: "Home", to: "/", label: "Home" },
    { title: "Add Grocery", to: "/add-grocery", label: "Add Grocery" },
    { title: "React Query Fetch", to: "/rq-fetch", label: "React Query" },
    {
      title: "Unlimit Scrolling Fetch",
      to: "/unlimit-scrolling",
      label: "Unlimit Scrolling",
    },
    { title: "Home", to: "/", label: "Home" },
  ];
  const handleNavigate = (to) => {
    navigate(to);
  };
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        Learn React Query
      </Link>
      <div className="nav-links">
        <select
          onChange={(e) => handleNavigate(e.target.value)}
          style={{ width: "150px", height: "30px" }}
          name="Navbar"
          id=""
        >
          {link.map((navbar) => (
            <option value={navbar.to}>{navbar.label}</option>
          ))}
        </select>
      </div>
    </nav>
  );
};

export default Navbar;
