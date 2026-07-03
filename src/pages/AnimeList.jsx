import { useState, useEffect } from 'react'
import AnimeCard from '../components/utils/AnimeCard'
import Loading from '../components/utils/Loading'

const API_BASE = 'https://api.jikan.moe/v4'

export default function AnimeList() {
  const [animeList, setAnimeList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [genres, setGenres] = useState([])
  const [selectedGenre, setSelectedGenre] = useState('')
  const [selectedType, setSelectedType] = useState('')

  useEffect(() => {
    async function fetchGenres() {
      try {
        const res = await fetch(`${API_BASE}/genres/anime`)
        if (!res.ok) throw new Error('Failed to fetch genres')
        const data = await res.json()
        setGenres(data.data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchGenres()
  }, [])

  useEffect(() => {
    async function fetchAnime() {
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams({ page })
        if (search) params.append('q', search)
        if (selectedGenre) params.append('genres', selectedGenre)
        if (selectedType) params.append('type', selectedType)

        const res = await fetch(`${API_BASE}/anime?${params}`)
        if (!res.ok) throw new Error('Failed to fetch anime')
        const data = await res.json()

        setAnimeList(data.data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchAnime()
  }, [page, search, selectedGenre, selectedType])

  function handleSearch(e) {
    e.preventDefault()
    setPage(1)
    setSearch(searchInput)
  }

  function handleGenreChange(e) {
    setSelectedGenre(e.target.value)
    setPage(1)
  }

  function handleTypeChange(e) {
    setSelectedType(e.target.value)
    setPage(1)
  }

  const types = [
    { value: 'tv', label: 'TV' },
    { value: 'movie', label: 'Movie' },
    { value: 'ova', label: 'OVA' },
    { value: 'special', label: 'Special' },
    { value: 'ona', label: 'ONA' },
  ]

  return (
    <div className="anime-list-page">
      <div className="anime-list-header">
        <h1 className="anime-list-title">Anime</h1>

        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search anime..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn">Search</button>
        </form>

        <div className="filter-bar">
          <select
            className="filter-select"
            value={selectedGenre}
            onChange={handleGenreChange}
          >
            <option value="">All Genres</option>
            {genres.map(g => (
              <option key={g.mal_id} value={g.mal_id}>{g.name}</option>
            ))}
          </select>

          <select
            className="filter-select"
            value={selectedType}
            onChange={handleTypeChange}
          >
            <option value="">All Types</option>
            {types.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : animeList.length === 0 ? (
        <div className="empty-message">No anime found.</div>
      ) : (
        <>
          <div className="anime-grid">
            {animeList.map(anime => (
              <AnimeCard key={anime.mal_id} anime={anime} />
            ))}
          </div>


        </>
      )}
    </div>
  )
}
