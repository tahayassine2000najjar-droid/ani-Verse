import { useState, useEffect } from 'react'
import CharacterCard from '../components/utils/CharacterCard'
import Loading from '../components/utils/Loading'

const API_BASE = 'https://api.jikan.moe/v4'

export default function CharacterList() {
  const [characters, setCharacters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')

  useEffect(() => {
    async function fetchCharacters() {
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams({ limit: '25' })
        if (search) params.append('q', search)

        const res = await fetch(`${API_BASE}/characters?${params}`)
        if (!res.ok) throw new Error('Failed to fetch characters')
        const data = await res.json()
        setCharacters(data.data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchCharacters()
  }, [search])

  function handleSearch(e) {
    e.preventDefault()
    setSearch(searchInput)
  }

  return (
    <div className="characters-page">
      <div className="characters-header">
        <h1 className="characters-title">Characters</h1>
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search characters..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn">Search</button>
        </form>
      </div>

      {loading ? (
        <Loading />
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : characters.length === 0 ? (
        <div className="empty-message">No characters found.</div>
      ) : (
        <div className="characters-grid">
          {characters.map(char => (
            <CharacterCard key={char.mal_id} character={char} />
          ))}
        </div>
      )}
    </div>
  )
}
