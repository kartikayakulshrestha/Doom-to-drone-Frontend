import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Center from "./Center.jsx"
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import store from './app/store'
import { Provider } from 'react-redux'
import ImageUpload from './ImageUpload.jsx'


const router = createBrowserRouter([
  {
    path: "/editor",
    element: <App />,
  },{path: "/imageselection",
    element:<ImageUpload />
  },{path:"/",
    element:<Center />
  }
]);
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
    <RouterProvider router={router} />
    </Provider>  
  </React.StrictMode>,
)
