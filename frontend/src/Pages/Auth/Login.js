import React, { useCallback, useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { loginAPI } from '../../utils/ApiRequest';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({ email: '', password: '' });

  const toastOptions = {
    position: 'bottom-right',
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    theme: 'dark',
  };

  useEffect(() => {
    if (localStorage.getItem('user')) {
      navigate('/');
    }
  }, [navigate]);

  const handleChange = e => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(loginAPI, values);
      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        toast.success(data.message, toastOptions);
        navigate('/');
      } else {
        toast.error(data.message, toastOptions);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong!', toastOptions);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    const guestUser = {
      role: 'guest',
      isGuest: true,
      isAvatarImageSet: true,
      avatarImage: '',
      name: 'Guest',
      _id: null,
    };
    localStorage.setItem('user', JSON.stringify(guestUser));
    toast.info('Logged in as Guest', toastOptions);
    navigate('/');
  };

  const particlesInit = useCallback(async engine => {
    await loadFull(engine);
  }, []);
  const particlesLoaded = useCallback(async container => {}, []);

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

      <Container className="mt-5" style={{ position: 'relative', zIndex: '2' }}>
        <Row>
          <Col md={{ span: 6, offset: 3 }}>
            <h1 className="text-center mt-5">
              <AccountBalanceWalletIcon sx={{ fontSize: 40, color: 'white' }} />
            </h1>
            <h2 className="text-white text-center">Login</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formBasicEmail" className="mt-3">
                <Form.Label className="text-white">Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  name="email"
                  onChange={handleChange}
                  value={values.email}
                />
              </Form.Group>

              <Form.Group controlId="formBasicPassword" className="mt-3">
                <Form.Label className="text-white">Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={handleChange}
                  value={values.password}
                />
              </Form.Group>

              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                }}
                className="mt-4"
              >
                <Link to="/forgotPassword" className="text-white lnk">
                  Forgot Password?
                </Link>
                <Button type="submit" className="text-center mt-3 btnStyle" disabled={loading}>
                  {loading ? 'Signing in…' : 'Login'}
                </Button>

                {/* Guest login button */}
                <Button
                  variant="secondary"
                  className="mt-2 btnStyle"
                  onClick={handleGuestLogin}
                  disabled={loading}
                >
                  Continue as Guest
                </Button>

                <p className="mt-3" style={{ color: '#9d9494' }}>
                  Don't have an account?{' '}
                  <Link to="/register" className="text-white lnk">
                    Register
                  </Link>
                </p>
              </div>
            </Form>
          </Col>
        </Row>
        <ToastContainer />
      </Container>
    </div>
  );
};

export default Login;
