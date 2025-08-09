import React from 'react';

const Login = () => {
  React.useEffect(() => {
    window.location.replace('/auth');
  }, []);
  return null;
};

export default Login;
