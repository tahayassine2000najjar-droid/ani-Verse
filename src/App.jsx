import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/utils/Navbar';
import "./App.css"


export default function App () {
  return (
    <div>
      <BrowserRouter>
      <Navbar />
      <Routes>
         {/* <Route path='/' element={<LandingPage/>} /> */}
      </Routes>
      </BrowserRouter>
    </div>
  )
}



