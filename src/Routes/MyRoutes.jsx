import { Routes, Route } from "react-router-dom";
import UserRQ from "../Components/UserRQ/UserRQ";
import AddGrocery from "../Pages/AddGrocery/AddGrocery";
import Home from "../Pages/Home";
import RQFetch from "../Pages/RQFetch/RQFetch";
import UnlimitScrolling from "../Pages/UnlimitScrolling/UnlimitScrolling";

const MyRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/rq-fetch" element={<RQFetch />} />
      <Route path="/rq-fetch/:userId" element={<UserRQ />} />
      <Route path="/add-grocery" element={<AddGrocery />} />
      <Route path="/unlimit-scrolling" element={<UnlimitScrolling />} />
    </Routes>
  );
};

export default MyRoutes;
