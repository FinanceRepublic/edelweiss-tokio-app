import React from 'react'
import DataWrapper, { useData } from './context/DataWrapper'

//import './chat-window.css
import './css/All.css'
import './css/msg.css'

import AuthContext from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import GlobalRoute from './components/GlobalRoute'
import {HashRouter as Router ,Routes,Route} from 'react-router-dom'
import Routing from './Routing'
import Page1 from './pages/Cues2'

export default function App() {
  //const {data} = useData()
  
  return (
    <AuthContext>
      {/* <DataWrapper> */}
          <Router>
            <Routing/>
          </Router>
      {/* </DataWrapper> */}
    </AuthContext>
//     <DataWrapper>
// <Page1/>
//     </DataWrapper>
    
      
  )
}
