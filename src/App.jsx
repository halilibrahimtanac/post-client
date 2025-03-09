import "./App.css";
import AuthScreen from "./components/Auth/AuthScreen";
import { Route, Routes } from "react-router-dom";
import PublicRoute from "./components/RouteWrapper/PublicRoute";
import ProtectedRoute from "./components/RouteWrapper/ProtectedRoute";
import RootRedirect from "./components/RouteWrapper/RouteRedirect";
import PostList from "./components/Post/PostList";
import Home from "./components/Home";

function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />

      <Route element={<PublicRoute />}>
        <Route path="/login" element={<AuthScreen form="login"/>}/>
        <Route path="/signup" element={<AuthScreen form="signup"/>}/>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<Home />}/>
      </Route>
    </Routes>
  );
}

export default App;
