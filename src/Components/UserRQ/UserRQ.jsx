import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router-dom";

const UserRQ = () => {
  const { userId } = useParams();
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["post", userId],
    queryFn: () => axios.get(`https://reqres.in/api/users/${userId}`),
    retry: false,
  });
  const userData = data?.data?.data || {};
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>{error?.message}</div>;
  return (
    <center>
      <div
        data-testid={`user-data`}
        style={{
          padding: "1rem",
          width: "200px",
          marginTop: "20px",
          borderRadius: "10px",
          boxShadow:
            "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
        }}
      >
        <img
          src={userData?.avatar}
          alt={`user-img-${userId}`}
          style={{ width: "100px", height: "100px" }}
        />
        <p data-testid={`user-name-${userId}`}>
          {userData?.first_name} {userData?.last_name}
        </p>
        <p data-testid={`user-email-${userId}`}>{userData?.email}</p>
      </div>
    </center>
  );
};
export default UserRQ;
