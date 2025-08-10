import React from 'react';

const Register = () => {
  React.useEffect(() => {
    window.location.replace('/auth?mode=signup');
  }, []);
  return null;
};

export default Register;
