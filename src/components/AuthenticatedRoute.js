import { Navigate } from 'react-router-dom';

const AuthenticatedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("authToken");

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return children;
};

export default AuthenticatedRoute;
