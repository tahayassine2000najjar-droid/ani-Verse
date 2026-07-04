import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Loading from '../components/utils/Loading'
import { getFavorites, removeFavorite } from '../api'

export default function Favorites() {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function loadFavorites() {
    setLoading(true)
    setError(null)
    try {
      const data = await getFavorites()
      setFavorites(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadFavorites() }, [])

  async function handleRemove(id) {
    try {
      await removeFavorite(id)
      setFavorites(prev => prev.filter(f => f.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <Loading />
  if (error) return <div className="error-message">{error}</div>

  return (
    <div className="list-page">
      <div className="list-page-header">
        <h1 className="list-page-title">My Favorites</h1>
      </div>

      {favorites.length === 0 ? (
        <div className="empty-message">
          No favorites yet.{' '}
          <Link to="/anime" className="back-link">Browse anime</Link>
        </div>
      ) : (
        <div className="list-grid">
          {favorites.map(fav => (
            <div key={fav.id} className="list-card">
              <Link to={`/anime/${fav.animeId}`} className="list-card-link">
                <div className="list-card-image">
                  <img src={fav.image} alt={fav.title} loading="lazy" />
                </div>
                <div className="list-card-body">
                  <h3 className="list-card-title">{fav.title}</h3>
                  {fav.score && (
                    <span className="list-card-score">Score: {fav.score}</span>
                  )}
                </div>
              </Link>
              <button
                className="list-card-remove"
                onClick={() => handleRemove(fav.id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
