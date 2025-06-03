import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import "../../styles.css";

const container = {
  marginTop: "10px",
  flexDirection: "column",
  display: "flex",
  gap: "40px",
};

const cart = {
  padding: "1rem",
  display: "flex",
  borderRadius: "10px",
  color: "black",
  boxShadow:
    "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
  alignItems: "center",
};

export default function UnlimitScrolling() {
  const { ref, inView } = useInView();

  const { data, isLoading, isError, error, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["infinite"],
      queryFn: ({ pageParam = 1 }) =>
        axios.get(`https://reqres.in/api/users?page=${pageParam}&per_page=2`, {
          headers: { "x-api-key": "reqres-free-v1" },
        }),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        const totalPages = lastPage?.data?.total_pages || 0;
        if (allPages.length < totalPages) {
          return allPages.length + 1;
        }
        return undefined;
      },
    });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  if (isLoading) return <div>...Loading</div>;
  if (isError) return <div>{error?.message}</div>;

  return (
    <center>
      <div className="App" style={container}>
        {data?.pages?.map((item) =>
          item?.data?.data.map((ele, i) => (
            <Link to={`/rq-fetch/${ele.id}`} key={i} style={cart}>
              <div>
                <img
                  src={ele.avatar}
                  alt=""
                  style={{ width: "50%", height: "70%", borderRadius: "10px" }}
                />
              </div>
              <div
                style={{
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                }}
              >
                <span>
                  {ele.first_name} {ele.last_name}
                </span>
                <span style={{ fontSize: "10px" }}>{ele.email}</span>
              </div>
            </Link>
          ))
        )}
        <h3 ref={ref}>{isFetchingNextPage ? "Loading..." : "End of Page"}</h3>
      </div>
    </center>
  );
}
