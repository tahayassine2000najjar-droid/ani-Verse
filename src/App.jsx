import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/utils/Navbar';
import LandingPage from './pages/LandingPage';
import AnimeList from './pages/AnimeList';
import AnimeDetail from './pages/AnimeDetail';
import AnimeCharacters from './pages/AnimeCharacters';
import CharacterList from './pages/CharacterList';
import CharacterProfile from './pages/CharacterProfile';
import Favorites from './pages/Favorites';
import MyRatings from './pages/MyRatings';
import MyLibrary from './pages/MyLibrary';
import Dashboard from './pages/Dashboard';
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
         <Route path='/favorites' element={<Favorites/>} />
         <Route path='/my-ratings' element={<MyRatings/>} />
         <Route path='/my-library' element={<MyLibrary/>} />
         <Route path='/dashboard' element={<Dashboard/>} />
      </Routes>
      </BrowserRouter>
    </div>
  )
}



