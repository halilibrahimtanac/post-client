import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { useGetAllPostsQuery } from "./store/post/query";
import AuthScreen from "./components/AuthScreen";

function App() {
  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.data.accessToken);
  const { data, isLoading, isError, isFetching, isSuccess } = useGetAllPostsQuery();

  if (!accessToken) {
    return <AuthScreen />;
  }

  return (
    <div
      style={{
        width: "50%",
        display: "flex",
        flexDirection: "column",
        gap: 15,
      }}
    >
      {isLoading && <span>Loading...</span>}
      {isError && <span>Error!</span>}
      {isSuccess && <span>{JSON.stringify(data)}</span>}
    </div>
  );
}

export default App;
