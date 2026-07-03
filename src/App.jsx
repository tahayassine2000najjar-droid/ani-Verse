import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/utils/Navbar';
import LandingPage from './pages/LandingPage';
import AnimeList from './pages/AnimeList';
import "./App.css"


export default function App () {
  return (
    <div>
      <BrowserRouter>
      <Navbar />
      <Routes>
         <Route path='/' element={<LandingPage/>} />
         <Route path='/anime' element={<AnimeList/>} />
      </Routes>
      </BrowserRouter>
    </div>
  )
}



