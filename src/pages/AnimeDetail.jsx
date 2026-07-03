import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Loading from '../components/utils/Loading'

const API_BASE = 'https://api.jikan.moe/v4'

export default function AnimeDetail() {
  const { id } = useParams()
  const [anime, setAnime] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [inFavorites, setInFavorites] = useState(false)
  const [inLibrary, setInLibrary] = useState(false)
  const [libraryStatus, setLibraryStatus] = useState('')
  const [rating, setRating] = useState(0)
  const [note, setNote] = useState('')

  useEffect(() => {
    async function fetchAnime() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`${API_BASE}/anime/${id}/full`)
        if (!res.ok) throw new Error('Failed to fetch anime')
        const data = await res.json()
        setAnime(data.data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchAnime()
  }, [id])

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]')
    setInFavorites(savedFavorites.includes(Number(id)))

    const savedRatings = JSON.parse(localStorage.getItem('ratings') || '{}')
    if (savedRatings[id]) setRating(savedRatings[id].score)
    if (savedRatings[id]) setNote(savedRatings[id].note || '')

    const savedLibrary = JSON.parse(localStorage.getItem('library') || '{}')
    if (savedLibrary[id]) {
      setInLibrary(true)
      setLibraryStatus(savedLibrary[id].status)
    }
  }, [id])

  function toggleFavorite() {
    const saved = JSON.parse(localStorage.getItem('favorites') || '[]')
    const idNum = Number(id)
    let updated
    if (inFavorites) {
      updated = saved.filter(fid => fid !== idNum)
    } else {
      updated = [...saved, idNum]
    }
    localStorage.setItem('favorites', JSON.stringify(updated))
    setInFavorites(!inFavorites)
  }

  function handleRating(value) {
    const saved = JSON.parse(localStorage.getItem('ratings') || '{}')
    saved[id] = { score: value, note }
    localStorage.setItem('ratings', JSON.stringify(saved))
    setRating(value)
  }

  function handleNoteChange(e) {
    const value = e.target.value
    setNote(value)
    const saved = JSON.parse(localStorage.getItem('ratings') || '{}')
    saved[id] = { score: rating, note: value }
    localStorage.setItem('ratings', JSON.stringify(saved))
  }

  function handleLibraryStatus(status) {
    const saved = JSON.parse(localStorage.getItem('library') || '{}')
    if (inLibrary && saved[id]?.status === status) {
      delete saved[id]
      localStorage.setItem('library', JSON.stringify(saved))
      setInLibrary(false)
      setLibraryStatus('')
    } else {
      saved[id] = { status, title: anime.title, image: anime.images?.jpg?.image_url }
      localStorage.setItem('library', JSON.stringify(saved))
      setInLibrary(true)
      setLibraryStatus(status)
    }
  }

  if (loading) return <Loading />
  if (error) return <div className="error-message">{error}</div>
  if (!anime) return <div className="empty-message">Anime not found.</div>

  return (
    <div className="anime-detail-page">
      <div className="anime-detail-hero" style={{
        backgroundImage: `linear-gradient(rgba(10,10,10,0.8), rgba(10,10,10,0.95)), url(${anime.images?.jpg?.large_image_url})`
      }}>
        <div className="anime-detail-hero-content">
          <img
            className="anime-detail-poster"
            src={anime.images?.jpg?.large_image_url}
            alt={anime.title}
          />
          <div className="anime-detail-hero-info">
            <h1 className="anime-detail-title">{anime.title}</h1>
            {anime.title_japanese && (
              <p className="anime-detail-jp-title">{anime.title_japanese}</p>
            )}
            <div className="anime-detail-meta">
              {anime.score && (
                <span className="anime-detail-score">Score: {anime.score}</span>
              )}
              {anime.episodes && (
                <span>{anime.episodes} episodes</span>
              )}
              {anime.status && <span>{anime.status}</span>}
              {anime.aired?.from && (
                <span>{new Date(anime.aired.from).getFullYear()}</span>
              )}
            </div>
            <div className="anime-detail-tags">
              {anime.genres?.map(g => (
                <span key={g.mal_id} className="tag">{g.name}</span>
              ))}
              {anime.studios?.map(s => (
                <span key={s.mal_id} className="tag tag-studio">{s.name}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="anime-detail-body">
        <div className="anime-detail-main">
          {anime.synopsis && (
            <section className="anime-detail-section">
              <h2>Synopsis</h2>
              <p className="anime-detail-synopsis">{anime.synopsis}</p>
            </section>
          )}

          {anime.trailer?.embed_url && (
            <section className="anime-detail-section">
              <h2>Trailer</h2>
              <div className="trailer-wrapper">
                <iframe
                  src={anime.trailer.embed_url}
                  title="Trailer"
                  allowFullScreen
                ></iframe>
              </div>
            </section>
          )}

          <div className="anime-detail-actions">
            <Link to={`/anime/${id}/characters`} className="action-btn">
              View Characters
            </Link>
          </div>
        </div>

        <aside className="anime-detail-sidebar">
          <section className="anime-detail-section">
            <h2>Actions</h2>

            <div className="action-group">
              <button
                className={`action-btn ${inFavorites ? 'active' : ''}`}
                onClick={toggleFavorite}
              >
                {inFavorites ? 'Remove from Favorites' : 'Add to Favorites'}
              </button>
            </div>

            <div className="action-group">
              <h3>Rate</h3>
              <div className="rating-stars">
                {[1,2,3,4,5,6,7,8,9,10].map(n => (
                  <button
                    key={n}
                    className={`star ${n <= rating ? 'filled' : ''}`}
                    onClick={() => handleRating(n)}
                  >
                    {n <= rating ? '\u2605' : '\u2606'}
                  </button>
                ))}
              </div>
              {rating > 0 && <span className="rating-value">{rating}/10</span>}
            </div>

            <div className="action-group">
              <h3>Personal Note</h3>
              <textarea
                className="note-input"
                placeholder="Write your thoughts..."
                value={note}
                onChange={handleNoteChange}
                rows={3}
              />
            </div>

            <div className="action-group">
              <h3>Library</h3>
              <div className="library-statuses">
                {['Plan To Watch', 'Watching', 'Completed'].map(s => (
                  <button
                    key={s}
                    className={`action-btn sm ${inLibrary && libraryStatus === s ? 'active' : ''}`}
                    onClick={() => handleLibraryStatus(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}
