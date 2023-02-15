import React, { useState } from 'react';
import  useAuth  from './Providers/auth.provider';
import { history } from 'react-router-guard';
import Dashboard from './Components/Shell/_dashboard';
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import { AuthStateHook, useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'



const App = () => {
  return (<Dashboard></Dashboard>)
};





export default App;