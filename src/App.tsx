import { RouterProvider } from 'react-router-dom';
import MainRouter from './routes/main-router';
import { Provider } from 'react-redux';
import store from './store/store';
import CommonPopup from './components/CommonPopup';

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={MainRouter}></RouterProvider>
      <CommonPopup />
    </Provider>
  );
}

export default App;
