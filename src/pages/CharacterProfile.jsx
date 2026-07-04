import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Loading from '../components/utils/Loading'

const API_BASE = 'https://api.jikan.moe/v4'

export default function CharacterProfile() {
  const { id } = useParams()
  const [character, setCharacter] = useState(null)
  const [animeList, setAnimeList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchCharacter() {
      setLoading(true)
      setError(null)
      try {
        const [charRes, animeRes] = await Promise.all([
          fetch(`${API_BASE}/characters/${id}`),
          fetch(`${API_BASE}/characters/${id}/anime`)
        ])

        if (!charRes.ok) throw new Error('Failed to fetch character')

        const charData = await charRes.json()
        setCharacter(charData.data)

        if (animeRes.ok) {
          const animeData = await animeRes.json()
          setAnimeList(animeData.data)
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchCharacter()
  }, [id])

  if (loading) return <Loading />
  if (error) return <div className="error-message">{error}</div>
  if (!character) return <div className="empty-message">Character not found.</div>

  return (
    <div className="character-profile-page">
      <div className="character-profile-header">
        <Link to="/characters" className="back-link">&larr; Back to Characters</Link>
      </div>

      <div className="character-profile-card">
        <div className="character-profile-image">
          <img
            src={character.images?.jpg?.image_url}
            alt={character.name}
          />
        </div>
        <div className="character-profile-info">
          <h1 className="character-profile-name">{character.name}</h1>
          {character.name_japanese && (
            <p className="character-profile-jp">{character.name_japanese}</p>
          )}
          {character.nicknames?.length > 0 && (
            <div className="character-profile-nicknames">
              {character.nicknames.map((nick, i) => (
                <span key={i} className="tag">{nick}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {character.about && (
        <section className="character-profile-section">
          <h2>About</h2>
          <p className="character-profile-about">{character.about}</p>
        </section>
      )}

      {animeList.length > 0 && (
        <section className="character-profile-section">
          <h2>Anime Appearances</h2>
          <div className="character-anime-grid">
            {animeList.map(item => (
              <Link
                key={item.anime.mal_id}
                to={`/anime/${item.anime.mal_id}`}
                className="character-anime-card"
              >
                <img
                  src={item.anime.images?.jpg?.image_url}
                  alt={item.anime.title}
                  loading="lazy"
                />
                <span className="character-anime-role">{item.role}</span>
                <span className="character-anime-title">{item.anime.title}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
