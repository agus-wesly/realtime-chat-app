import React from 'react'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import Login from './components/Login/Login'
import Chat from './components/Chat/Chat'

const App = () => {
  return (
    <Router>
        <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/chat' element={<Chat />} />
        </Routes>
    </Router>
  )
}

export default App