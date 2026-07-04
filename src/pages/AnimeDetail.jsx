import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Loading from '../components/utils/Loading'
import { getFavorites, addFavorite, removeFavorite, getRatings, upsertRating, getLibrary, addToLibrary, removeFromLibrary, updateLibraryItem } from '../api'

const API_BASE = 'https://api.jikan.moe/v4'

export default function AnimeDetail() {
  const { id } = useParams()
  const [anime, setAnime] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [inFavorites, setInFavorites] = useState(false)
  const [favId, setFavId] = useState(null)
  const [inLibrary, setInLibrary] = useState(false)
  const [libId, setLibId] = useState(null)
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
    async function loadUserData() {
      try {
        const [favorites, ratings, library] = await Promise.all([
          getFavorites(),
          getRatings(),
          getLibrary()
        ])

        const fav = favorites.find(f => f.animeId === Number(id))
        if (fav) {
          setInFavorites(true)
          setFavId(fav.id)
        }

        const rat = ratings.find(r => r.animeId === Number(id))
        if (rat) {
          setRating(rat.score)
          setNote(rat.note || '')
        }

        const lib = library.find(l => l.animeId === Number(id))
        if (lib) {
          setInLibrary(true)
          setLibId(lib.id)
          setLibraryStatus(lib.status)
        }
      } catch (err) {
        console.error(err)
      }
    }
    loadUserData()
  }, [id])

  async function toggleFavorite() {
    try {
      if (inFavorites) {
        await removeFavorite(favId)
        setInFavorites(false)
        setFavId(null)
      } else {
        const data = await addFavorite(anime)
        setInFavorites(true)
        setFavId(data.id)
      }
    } catch (err) {
      console.error(err)
    }
  }

  async function handleRating(value) {
    try {
      await upsertRating(Number(id), value, note)
      setRating(value)
    } catch (err) {
      console.error(err)
    }
  }

  async function handleNoteChange(e) {
    const value = e.target.value
    setNote(value)
    try {
      await upsertRating(Number(id), rating, value)
    } catch (err) {
      console.error(err)
    }
  }

  async function handleLibraryStatus(status) {
    try {
      if (inLibrary && libraryStatus === status) {
        await removeFromLibrary(libId)
        setInLibrary(false)
        setLibId(null)
        setLibraryStatus('')
      } else if (inLibrary) {
        await updateLibraryItem(libId, status)
        setLibraryStatus(status)
      } else {
        const data = await addToLibrary(
          anime.mal_id,
          anime.title,
          anime.images?.jpg?.image_url,
          status
        )
        setInLibrary(true)
        setLibId(data.id)
        setLibraryStatus(status)
      }
    } catch (err) {
      console.error(err)
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
