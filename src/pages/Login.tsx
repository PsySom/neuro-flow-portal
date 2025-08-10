import React from 'react';

const Login = () => {
  React.useEffect(() => {
    window.location.replace('/auth?mode=login');
  }, []);
  return null;
};

export default Login;
