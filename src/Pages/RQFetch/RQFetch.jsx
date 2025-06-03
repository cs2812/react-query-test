import { useState } from "react";
import Pagination from "../../Components/Pagination/Pagination";
import axios from "axios";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import "../../styles.css";
const container = {
  marginTop: "10px",
  display: "flex",
  flexWrap: "wrap",
  gap: "10px",
  justifyContent: "center",
  height: "300px",
};

const cart = {
  padding: "1rem",
  width: "150px",
  borderRadius: "10px",
  color: "black",
  height: "250px",
  boxShadow:
    "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
};
const fetchUsers = (page) => {
  return axios.get(`https://reqres.in/api/users?page=${page}&per_page=2`, {
    headers: { "x-api-key": "reqres-free-v1" },
  });
};
const RQFetch = () => {
  const [page, setPage] = useState(1);
  const {
    data,
    refetch,
    isLoading,
    error,
    isError,
    // isFetched,
    // isFetching,
    // fetchStatus,
    // isSuccess,
  } = useQuery({
    queryKey: ["users", page],
    queryFn: () => fetchUsers(page),
    // staleTime: 30000,
    // refetchInterval: 10000,// to refetch data in interval (if switch to another tab, it will stop)
    // refetchIntervalInBackground: true, // to fetchData when tab is not active
    // enabled: false, //use to prevent data fetching on every component mount
    placeholderData: keepPreviousData,
  });
  // console.log();
  if (isLoading) {
    return <div>...Loading</div>;
  }

  if (isError) {
    return <div>{error.message}</div>;
  }
  let totalPages = data?.data?.total_pages || 0;

  return (
    <center>
      <button
        style={{ marginTop: "10px" }}
        onClick={refetch}
        data-testid="refetch-button"
      >
        React Query Fetch
      </button>
      <div className="App" style={container}>
        {data?.data?.data?.map((ele) => (
          <Link
            to={`/rq-fetch/${ele.id}`}
            key={ele.id}
            style={cart}
            data-testid={`user-card-${ele.id}`}
          >
            <img
              src={ele.avatar}
              alt=""
              style={{ width: "100%", height: "70%", borderRadius: "10px" }}
            />
            <div style={{ textDecoration: "none" }}>
              <p>
                {ele.first_name} {ele.last_name}
              </p>
              <p style={{ fontSize: "10px" }}>{ele.email}</p>
            </div>
          </Link>
        ))}
      </div>
      {!!totalPages && (
        <Pagination
          totalPages={totalPages}
          currentPage={page}
          onPageChange={setPage}
        />
      )}
    </center>
  );
};
export default RQFetch;
