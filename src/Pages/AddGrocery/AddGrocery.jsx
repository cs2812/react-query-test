import { useEffect, useState } from "react";
import "../../styles.css";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
const inputStyle = { padding: "0.5rem", flexGrow: "1" };

const fetchGrocery = () => {
  return axios.get(`http://localhost:8080/grocery`);
};

const addGrocery = (post) => {
  return axios.post(`http://localhost:8080/grocery`, post);
};

const AddGrocery = () => {
  const [item, setItem] = useState({});
  const queryClient = useQueryClient();

  // Get data
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["grocery"],
    queryFn: () => fetchGrocery(),
  });

  // Post and update
  const { mutate } = useMutation({
    mutationFn: addGrocery,
    // onSuccess: (newData) => {
    // # to clear cash of (grocery item) so that react query will fetch new upadted data.
    // queryClient.invalidateQueries("grocery");

    // # queryClient.setQueryData(["grocery"], (previousGroceryData) => ({
    //   ...previousGroceryData,
    //   data: [...previousGroceryData.data, newData.data],
    // }));
    // },

    // Method to updating previous data before making Post or Updated request
    onMutate: async (newData) => {
      // to cancel the query request
      await queryClient.cancelQueries(["grocery"]);

      // to update previous data before post request
      const previousPostData = queryClient.setQueryData(["grocery"]);
      queryClient.setQueryData(["grocery"], (previousGroceryData) => ({
        ...previousGroceryData,
        data: [...previousGroceryData.data, newData],
      }));
      return {
        previousPostData,
      };
    },

    // handle and informing for isError in post to mutation funtion
    onError: (_error, _post, context) => {
      queryClient.setQueryData(["grocery"], context.previousPostData);
    },

    // final settled function
    onSettled: () => {
      queryClient.invalidateQueries(["grocery"]);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem((pre) => ({ ...pre, [name]: value }));
  };

  const handleAddGrocery = (e) => {
    if (!item.name || !item.price || !item.image) {
      return alert("Please fill all fields");
    }

    const newGrocery = {
      id: data.data.length + 1,
      ...item,
    };
    mutate(newGrocery);
    setItem({});
  };

  if (isLoading) {
    return <>Loading...</>;
  }

  return (
    <>
      {/* Add Grocery */}
      <div
        style={{
          display: "flex",
          gap: "2px",
          marginTop: "10px",
          flexWrap: "wrap",
        }}
      >
        <input
          onChange={handleChange}
          placeholder="Grocery name"
          style={inputStyle}
          type="text"
          name="name"
          value={item?.name || ""}
        />
        <input
          onChange={handleChange}
          placeholder="Price"
          style={inputStyle}
          type="text"
          name="price"
          value={item?.price || ""}
        />
        <input
          onChange={handleChange}
          placeholder="Image url"
          style={inputStyle}
          type="text"
          name="image"
          value={item?.image || ""}
        />
        <button
          title="submit item"
          style={inputStyle}
          onClick={handleAddGrocery}
        >
          Submit
        </button>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          marginTop: "30px",
          textAlign: "center",
          gap: "20px",
          justifyContent: "center",
          overflowY: "auto",
          overflowX: "hidden",
          maxHeight: "calc(100vh - 150px)",
        }}
      >
        {!!data?.data &&
          data.data.map((ele, i) => (
            <div
              key={i}
              title="Grocery Item"
              style={{
                border: "1px solid",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "200px",
                borderRadius: "10px",
                padding: "1rem",
              }}
            >
              <img title="grocery img" width="100px" src={ele.image} alt={ele.image} />
              <div>
                <p  title="grocery name">{ele.name}</p>
                <p title="grocery price">{"$" + ele.price + "/kg"}</p>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};
export default AddGrocery;
