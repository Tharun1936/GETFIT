import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import styled from "styled-components";
import { lightTheme } from "./utils/theme";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Authentication from "./pages/Authentication";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Workouts from "./pages/Workouts";
import Tutorials from "./pages/Tutorials";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import Goals from "./pages/Goals";
import Analytics from "./pages/Analytics";
import { logout } from "./redux/reducers/userSlice";


const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text_primary};
  overflow-x: hidden;
  overflow-y: hidden;
  transition: all 0.2s ease;
`;


// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("getfit-app-token");
    if (!token || !currentUser) {
      dispatch(logout());
      navigate("/", { replace: true });
    }
  }, [currentUser, navigate, dispatch]);

  // Listen for unauthorized events from Axios interceptor
  useEffect(() => {
    const handleUnauthorized = () => {
      dispatch(logout());
      navigate("/", { replace: true });
    };

    window.addEventListener("unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("unauthorized", handleUnauthorized);
    };
  }, [navigate, dispatch]);

  if (!currentUser) {
    return null; // Will redirect via useEffect
  }

  return children;
};

function App() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // Handle unauthorized events globally
  useEffect(() => {
    const handleUnauthorized = () => {
      dispatch(logout());
    };

    window.addEventListener("unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("unauthorized", handleUnauthorized);
    };
  }, [dispatch]);

  return (
    <ThemeProvider theme={lightTheme}>
      <BrowserRouter>
        {currentUser ? (
          <Container>
            <Navbar currentUser={currentUser} />
            <Routes>
              <Route
                path="/"
                exact
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/workouts"
                exact
                element={
                  <ProtectedRoute>
                    <Workouts />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tutorials"
                exact
                element={
                  <ProtectedRoute>
                    <Tutorials />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/contact"
                exact
                element={
                  <ProtectedRoute>
                    <Contact />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                exact
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/goals"
                exact
                element={
                  <ProtectedRoute>
                    <Goals />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analytics"
                exact
                element={
                  <ProtectedRoute>
                    <Analytics />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Container>
        ) : (
          <Container>
            <Authentication />
          </Container>
        )}
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
