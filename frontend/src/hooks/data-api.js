import { useEffect, useReducer } from "react";

const cache = {};

const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case "FETCHING":
      return {
        ...state,
        status: "fetching",
        error: null,
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        status: "success",
        error: null,
        data: action.payload,
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        status: "error",
        error: action.payload,
      };
    default:
      throw new Error();
  }
};

export default function useDataApi(urlPath) {
  let urlHost = "";
  if (process.env.NODE_ENV === "development") {
    urlHost = "http://localhost:8000/";
  }

  if (process.env.NODE_ENV === "production") {
    urlHost = "";
  }

  const url = new URL(urlPath, urlHost);

  const [state, dispatch] = useReducer(dataFetchReducer, {
    status: "idle",
    error: null,
    data: [],
  });

  useEffect(() => {
    let didCancel = false;
    if (!url) return;
    console.log(url);

    const fetchData = async () => {
      dispatch({ type: "FETCHING" });

      if (cache[url]) {
        const data = cache[url];
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } else {
        try {
          const response = await fetch(url);
          const data = await response.json();
          cache[url] = data;
          if (!didCancel) {
            dispatch({ type: "FETCH_SUCCESS", payload: data });
          }
        } catch (error) {
          if (!didCancel) {
            dispatch({ type: "FETCH_FAILURE", payload: error.message });
          }
        }
      }
    };

    fetchData();

    return () => {
      didCancel = true;
    };
  }, [urlPath]);

  return [state];
}
