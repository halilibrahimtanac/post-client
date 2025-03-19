
import PostList from "./Post/PostList";
import { useNavigate } from "react-router-dom";
import { useLogOutMutation } from "../store/user/mutation";

const Home = () => {
  

  return (<PostList />);
};

export default Home;
