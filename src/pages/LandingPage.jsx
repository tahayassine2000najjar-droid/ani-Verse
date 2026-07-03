import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AnimeCard from '../components/utils/AnimeCard'
import Loading from '../components/utils/Loading'

const API_BASE = 'https://api.jikan.moe/v4'

export default function LandingPage() {
  const [trending, setTrending] = useState([])
  const [seasonal, setSeasonal] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const [trendingRes, seasonalRes] = await Promise.all([
          fetch(`${API_BASE}/top/anime?limit=6`),
          fetch(`${API_BASE}/seasons/now?limit=6`)
        ])

        if (!trendingRes.ok || !seasonalRes.ok) {
          throw new Error('Failed to fetch anime data')
        }

        const trendingData = await trendingRes.json()
        const seasonalData = await seasonalRes.json()

        setTrending(trendingData.data)
        setSeasonal(seasonalData.data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <Loading />
  if (error) return <div className="error-message">{error}</div>

  return (
    <div className="landing-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">AniVerse</h1>
          <p className="hero-description">
            Discover and organize your personal anime universe. Explore trending
            titles, track your favorites, and build your own collection.
          </p>
          <Link to="/anime" className="hero-btn">Explore Anime</Link>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Trending Anime</h2>
          <span className="section-badge">Top</span>
        </div>
        {trending.length === 0 ? (
          <p className="empty-message">No trending anime available.</p>
        ) : (
          <div className="anime-grid">
            {trending.map(anime => (
              <AnimeCard key={anime.mal_id} anime={anime} />
            ))}
          </div>
        )}
      </section>

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Seasonal Anime</h2>
          <span className="section-badge">Current</span>
        </div>
        {seasonal.length === 0 ? (
          <p className="empty-message">No seasonal anime available.</p>
        ) : (
          <div className="anime-grid">
            {seasonal.map(anime => (
              <AnimeCard key={anime.mal_id} anime={anime} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
