import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Loading from '../components/utils/Loading'
import { getRatings, upsertRating, deleteRating } from '../api'

const API_BASE = 'https://api.jikan.moe/v4'

export default function MyRatings() {
  const [ratings, setRatings] = useState([])
  const [animeTitles, setAnimeTitles] = useState({})
  const [animeImages, setAnimeImages] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editing, setEditing] = useState(null)
  const [editScore, setEditScore] = useState(0)
  const [editNote, setEditNote] = useState('')

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await getRatings()
        setRatings(data)

        const titles = {}
        const images = {}
        await Promise.all(data.map(async r => {
          try {
            const res = await fetch(`${API_BASE}/anime/${r.animeId}`)
            if (res.ok) {
              const d = await res.json()
              titles[r.animeId] = d.data.title
              images[r.animeId] = d.data.images?.jpg?.image_url
            }
          } catch {}
        }))
        setAnimeTitles(titles)
        setAnimeImages(images)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  function startEdit(r) {
    setEditing(r.id)
    setEditScore(r.score)
    setEditNote(r.note || '')
  }

  async function handleSave(id, animeId) {
    try {
      await upsertRating(animeId, editScore, editNote)
      setRatings(prev => prev.map(r =>
        r.id === id ? { ...r, score: editScore, note: editNote } : r
      ))
      setEditing(null)
    } catch (err) {
      console.error(err)
    }
  }

  async function handleDelete(id) {
    try {
      await deleteRating(id)
      setRatings(prev => prev.filter(r => r.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <Loading />
  if (error) return <div className="error-message">{error}</div>

  return (
    <div className="list-page">
      <div className="list-page-header">
        <h1 className="list-page-title">My Ratings</h1>
      </div>

      {ratings.length === 0 ? (
        <div className="empty-message">
          No ratings yet.{' '}
          <Link to="/anime" className="back-link">Browse anime</Link>
        </div>
      ) : (
        <div className="ratings-list">
          {ratings.map(r => (
            <div key={r.id} className="rating-card">
              <div className="rating-card-image">
                <img
                  src={animeImages[r.animeId]}
                  alt={animeTitles[r.animeId]}
                  loading="lazy"
                />
              </div>
              <div className="rating-card-body">
                <Link to={`/anime/${r.animeId}`} className="rating-card-title">
                  {animeTitles[r.animeId] || `Anime #${r.animeId}`}
                </Link>

                {editing === r.id ? (
                  <div className="rating-edit-form">
                    <div className="rating-stars">
                      {[1,2,3,4,5,6,7,8,9,10].map(n => (
                        <button
                          key={n}
                          className={`star ${n <= editScore ? 'filled' : ''}`}
                          onClick={() => setEditScore(n)}
                        >
                          {n <= editScore ? '\u2605' : '\u2606'}
                        </button>
                      ))}
                    </div>
                    <textarea
                      className="note-input"
                      value={editNote}
                      onChange={e => setEditNote(e.target.value)}
                      rows={2}
                      placeholder="Your thoughts..."
                    />
                    <div className="rating-edit-actions">
                      <button className="action-btn sm" onClick={() => handleSave(r.id, r.animeId)}>Save</button>
                      <button className="action-btn sm" onClick={() => setEditing(null)}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="rating-display">
                      <span className="rating-score">{r.score}/10</span>
                      {r.note && <p className="rating-note">{r.note}</p>}
                    </div>
                    <div className="rating-actions">
                      <button className="action-btn sm" onClick={() => startEdit(r)}>Edit</button>
                      <button className="action-btn sm" onClick={() => handleDelete(r.id)}>Delete</button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
