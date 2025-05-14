import React, { useCallback, useEffect, useState } from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import "./style.css";
import { useNavigate, Link } from 'react-router-dom';
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const toastOptions = {
    position: "bottom-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    theme: "dark",
  };

  // Retrieve user from local storage on mount.
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser({ isGuest: true });
    }
  }, []);

  const handleShowLogin = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {}, []);

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          background: { color: { value: '#000' } },
          fpsLimit: 60,
          particles: {
            number: { value: 200, density: { enable: true, value_area: 800 } },
            color: { value: '#ffcc00' },
            shape: { type: 'circle' },
            opacity: { value: 0.5, random: true },
            size: { value: 3, random: { enable: true, minimumValue: 1 } },
            links: { enable: false },
            move: { enable: true, speed: 2 },
            life: {
              duration: { sync: false, value: 3 },
              count: 0,
              delay: { random: { enable: true, minimumValue: 0.5 }, value: 1 },
            },
          },
          detectRetina: true,
        }}
        style={{
          position: 'absolute',
          zIndex: -1,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />

      <Navbar collapseOnSelect expand="lg" className="navbarCSS" style={{ position: 'relative', zIndex: 2 }}>
        <Navbar.Brand as={Link} to="/" className="text-white navTitle">
          Expense Management System
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="responsive-navbar-nav"
          style={{ backgroundColor: "transparent", borderColor: "transparent" }}
        >
          <span
            className="navbar-toggler-icon"
            style={{
              background: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30'%3e%3cpath stroke='rgba(255, 255, 255)' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e")`,
            }}
          ></span>
        </Navbar.Toggle>
        <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end" style={{ color: "white" }}>
          {user ? (
            <>
              <Nav>
                <Nav.Link as={Link} to="/" className="text-white">Home</Nav.Link>

                {/* Stocks always gated behind login */}
                <Nav.Link
                  className="text-white"
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    if (user.isGuest) {
                      toast.info('Please login to access stocks', toastOptions);
                      return navigate('/login');
                    }
                    navigate('/stocks');
                  }}
                >
                  Stocks
                </Nav.Link>

                {user.role === "admin" && (
                  <Nav.Link as={Link} to="/admin" className="text-white">Admin</Nav.Link>
                )}
              </Nav>
              <Nav>
                <Button variant="primary" onClick={handleLogout} className="ml-2">
                  Logout
                </Button>
              </Nav>
            </>
          ) : (
            <Nav>
              <Button variant="primary" onClick={handleShowLogin} className="ml-2">
                Login
              </Button>
            </Nav>
          )}
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default Header;
