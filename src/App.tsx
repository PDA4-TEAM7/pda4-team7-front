import { RouterProvider } from "react-router-dom";
import MainRouter from "./routes/main-router";
import { Provider } from "react-redux";
import store from "./store/store";
import CommonPopup from "./components/CommonPopup";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
function App() {
  return (
    <Provider store={store}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <RouterProvider router={MainRouter}></RouterProvider>
        <CommonPopup />
      </LocalizationProvider>
    </Provider>
  );
}

export default App;
