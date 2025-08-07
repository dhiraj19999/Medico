
import './App.css'

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';

import Navbar from './components/Navbar';
import SignupForm from './pages/SignUp';
import LoginForm from './pages/Login';
function App() {
  return (
    <BrowserRouter>
      <Navbar />
   
      <SignupForm/>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Add more routes here */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;













