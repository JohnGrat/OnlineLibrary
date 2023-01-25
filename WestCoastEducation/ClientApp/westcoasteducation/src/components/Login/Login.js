import React, { useState }  from 'react';
import { string } from 'prop-types';

import {
    Title,
} from './styles';

// function Login ({
//     title,
// }) {
//     return (
//         <Title>{title}</Title>
//     );
// }

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const encodedCredentials = btoa(`${username}:${password}`);
      const response = await fetch('https://localhost:7253/api/connect/authorize', {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${encodedCredentials}`
        }
      });
      if(!response.ok) throw new Error(response.statusText);
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <div style={{ backgroundColor: 'black', height: '100vh' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Username" 
            value={username} 
            onChange={event => setUsername(event.target.value)}
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={event => setPassword(event.target.value)}
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

Login.defaultProps = {
    title: "",
};

Login.propTypes = {
    title: string,
};

export default Login;
