import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import "./common/style/common.style.css";
import AppLayout from "./Layout/AppLayout";
import AppRouter from "./routes/AppRouter";
import { loginWithToken } from "./features/user/userSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loginWithToken());
  }, [dispatch]);

  return (
    <div>
      <AppLayout>
        <AppRouter />
      </AppLayout>
    </div>
  );
}

export default App;
