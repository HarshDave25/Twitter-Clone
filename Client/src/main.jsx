// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/Home.jsx';
import Profile from './pages/Profile.jsx';
import Error from './pages/Error.jsx';
import App from './App';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ProtectedRoute from './components/ProtectedRoute';
import TweetDetails from './pages/TweetDetails.jsx';
import UserProfile from './pages/UserProfile.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        path: '/',
        element: <ProtectedRoute element={Home} />,
      },
      {
        path: 'profile',
        element: <ProtectedRoute element={Profile} />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Register />,
      },
      {
        path: '/tweets/:id',
        element: <ProtectedRoute element={TweetDetails} />
      },
      {
        path: '/users/:id',
        element: <UserProfile />
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
