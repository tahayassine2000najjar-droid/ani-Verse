import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/utils/Navbar';
import LandingPage from './pages/LandingPage';
import AnimeList from './pages/AnimeList';
import AnimeDetail from './pages/AnimeDetail';
import AnimeCharacters from './pages/AnimeCharacters';
import CharacterList from './pages/CharacterList';
import CharacterProfile from './pages/CharacterProfile';
import "./App.css"


export default function App () {
  return (
    <div>
      <BrowserRouter>
      <Navbar />
      <Routes>
         <Route path='/' element={<LandingPage/>} />
         <Route path='/anime' element={<AnimeList/>} />
         <Route path='/anime/:id' element={<AnimeDetail/>} />
         <Route path='/anime/:id/characters' element={<AnimeCharacters/>} />
         <Route path='/characters' element={<CharacterList/>} />
         <Route path='/characters/:id' element={<CharacterProfile/>} />
      </Routes>
      </BrowserRouter>
    </div>
  )
}



