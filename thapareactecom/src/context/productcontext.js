import axios from "axios";
import { createContext, useContext, useEffect, useReducer } from "react";
import reducer from "../reducer/productReducer";

const AppContext = createContext();

// const API = "https://api.pujakaitem.com/api/products";
// const API = `https://${process.env.REACT_APP_BACKEND_URL}/api/products`;
const API = `https://ecomm-jyp6i8gjz-deepak19158s-projects.vercel.app/api/products`;

const initialState = {
  isLoading: false,
  isError: false,
  products: [],
  featuredProduct: [],
  isSingleLoading: false,
  singleProduct: {},
};

// basic knowlegde
// - reducer = to operate on data (basically if else)
// - axios = to fetch api/url
// - context = to propogate data to different component

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const getProducts = async (url) => {
    dispatch({ type: "SET_LOADING" });
    try {
      const res = await axios.get(url);
      const products = await res.data.Products;
      dispatch({ type: "SET_API_DATA", payload: products });
    } catch (error) {
      dispatch({ type: "API_ERROR" });
    }
  };

  const getSingleProduct = async (url) => {
    dispatch({ type: "SET_SINGLE_LOADING" });
    try {
      const res = await axios.get(url);
      const singleProduct = await res.data;
      dispatch({ type: "SET_SINGLE_PRODUCT", payload: singleProduct });
    } catch (error) {
      dispatch({ type: "SET_SINGLE_ERROR" });
    }
  };

  useEffect(() => {
    getProducts(API);
  }, []);

  return (
    <AppContext.Provider value={{ ...state, getSingleProduct }}>
      {children}
    </AppContext.Provider>
  );
};

const useProductContext = () => {
  return useContext(AppContext);
};

export { AppProvider, useProductContext };
