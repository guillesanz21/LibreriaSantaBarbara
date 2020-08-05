import axios from "axios";
import { FETCH_POSTS } from "../types";

export const fetchPosts = () => async (dispatch) => {
  const res = await axios.get("https://jsonplaceholder.typicode.com/posts");
  dispatch({ type: FETCH_POSTS, payload: res.data });
};

// export const fetchPosts2 = () => ({
//   type: FETCH_POSTS,
//   payload: ["hi", "hello", "bye", "goodbye"],
// });
