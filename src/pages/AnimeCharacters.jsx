import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import CharacterCard from '../components/utils/CharacterCard'
import Loading from '../components/utils/Loading'

const API_BASE = 'https://api.jikan.moe/v4'

export default function AnimeCharacters() {
  const { id } = useParams()
  const [characters, setCharacters] = useState([])
  const [animeTitle, setAnimeTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchCharacters() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`${API_BASE}/anime/${id}/characters`)
        if (!res.ok) throw new Error('Failed to fetch characters')
        const data = await res.json()
        setCharacters(data.data)

        const animeRes = await fetch(`${API_BASE}/anime/${id}`)
        if (animeRes.ok) {
          const animeData = await animeRes.json()
          setAnimeTitle(animeData.data.title)
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchCharacters()
  }, [id])

  if (loading) return <Loading />
  if (error) return <div className="error-message">{error}</div>
  if (characters.length === 0) return <div className="empty-message">No characters found for this anime.</div>

  return (
    <div className="characters-page">
      <div className="characters-header">
        <Link to={`/anime/${id}`} className="back-link">&larr; Back to Anime</Link>
        <h1 className="characters-title">{animeTitle || 'Anime'} - Characters</h1>
      </div>

      <div className="characters-grid">
        {characters.map(char => (
          <CharacterCard key={char.character.mal_id} character={char} />
        ))}
      </div>
    </div>
  )
}
