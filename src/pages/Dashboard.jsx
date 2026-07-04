import { useState, useEffect } from 'react'
import Loading from '../components/utils/Loading'
import { getFavorites, getRatings, getLibrary } from '../api'

const API_BASE = 'https://api.jikan.moe/v4'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadStats() {
      setLoading(true)
      setError(null)
      try {
        const [favorites, ratings, library] = await Promise.all([
          getFavorites(),
          getRatings(),
          getLibrary()
        ])

        const completedCount = library.filter(l => l.status === 'Completed').length

        const avgRating = ratings.length
          ? (ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length).toFixed(1)
          : 'N/A'

        let topGenre = 'N/A'
        if (favorites.length > 0) {
          const genreCounts = {}
          await Promise.all(favorites.map(async fav => {
            try {
              const res = await fetch(`${API_BASE}/anime/${fav.animeId}`)
              if (res.ok) {
                const data = await res.json()
                data.data.genres?.forEach(g => {
                  genreCounts[g.name] = (genreCounts[g.name] || 0) + 1
                })
              }
            } catch {}
          }))
          const entries = Object.entries(genreCounts)
          if (entries.length > 0) {
            topGenre = entries.sort((a, b) => b[1] - a[1])[0][0]
          }
        }

        let totalEpisodes = 0
        await Promise.all(library.map(async item => {
          try {
            const res = await fetch(`${API_BASE}/anime/${item.animeId}`)
            if (res.ok) {
              const data = await res.json()
              totalEpisodes += data.data.episodes || 0
            }
          } catch {}
        }))

        setStats({
          totalFavorites: favorites.length,
          completedCount,
          avgRating,
          topGenre,
          totalEpisodes
        })
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  if (loading) return <Loading />
  if (error) return <div className="error-message">{error}</div>
  if (!stats) return <div className="empty-message">No data available.</div>

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1 className="list-page-title">Dashboard</h1>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <span className="dashboard-number">{stats.totalFavorites}</span>
          <span className="dashboard-label">Total Favorites</span>
        </div>

        <div className="dashboard-card">
          <span className="dashboard-number">{stats.completedCount}</span>
          <span className="dashboard-label">Completed</span>
        </div>

        <div className="dashboard-card">
          <span className="dashboard-number">{stats.avgRating}</span>
          <span className="dashboard-label">Average Rating</span>
        </div>

        <div className="dashboard-card">
          <span className="dashboard-number">{stats.topGenre}</span>
          <span className="dashboard-label">Top Genre</span>
        </div>

        <div className="dashboard-card dashboard-card-wide">
          <span className="dashboard-number">{stats.totalEpisodes}</span>
          <span className="dashboard-label">Total Episodes Watched</span>
        </div>
      </div>
    </div>
  )
}
