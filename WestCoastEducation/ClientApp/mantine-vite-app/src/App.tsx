import React, { useState } from 'react';
import  useAuth  from './Providers/auth.provider';
import { history } from 'react-router-guard';
import Dashboard from './Components/Shell/_dashboard';

const App = () => {
  return (<Dashboard></Dashboard>)
};


export default App;