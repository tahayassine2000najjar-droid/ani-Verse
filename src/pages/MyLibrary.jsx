import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Loading from '../components/utils/Loading'
import { getLibrary, updateLibraryItem, removeFromLibrary } from '../api'

const STATUSES = ['Plan To Watch', 'Watching', 'Completed']

export default function MyLibrary() {
  const [library, setLibrary] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('')

  async function loadLibrary() {
    setLoading(true)
    setError(null)
    try {
      const data = await getLibrary()
      setLibrary(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadLibrary() }, [])

  async function handleStatusChange(item, newStatus) {
    try {
      if (item.status === newStatus) {
        await removeFromLibrary(item.id)
        setLibrary(prev => prev.filter(l => l.id !== item.id))
      } else {
        await updateLibraryItem(item.id, newStatus)
        setLibrary(prev => prev.map(l =>
          l.id === item.id ? { ...l, status: newStatus } : l
        ))
      }
    } catch (err) {
      console.error(err)
    }
  }

  async function handleRemove(id) {
    try {
      await removeFromLibrary(id)
      setLibrary(prev => prev.filter(l => l.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  const filtered = filter
    ? library.filter(item => item.status === filter)
    : library

  if (loading) return <Loading />
  if (error) return <div className="error-message">{error}</div>

  return (
    <div className="list-page">
      <div className="list-page-header">
        <h1 className="list-page-title">My Library</h1>
        <div className="filter-bar">
          <button
            className={`filter-btn ${!filter ? 'active' : ''}`}
            onClick={() => setFilter('')}
          >All</button>
          {STATUSES.map(s => (
            <button
              key={s}
              className={`filter-btn ${filter === s ? 'active' : ''}`}
              onClick={() => setFilter(s)}
            >{s}</button>
          ))}
        </div>
      </div>

      {library.length === 0 ? (
        <div className="empty-message">
          Your library is empty.{' '}
          <Link to="/anime" className="back-link">Browse anime</Link>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-message">No items with this status.</div>
      ) : (
        <div className="list-grid">
          {filtered.map(item => (
            <div key={item.id} className="list-card">
              <Link to={`/anime/${item.animeId}`} className="list-card-link">
                <div className="list-card-image">
                  <img src={item.image} alt={item.title} loading="lazy" />
                </div>
                <div className="list-card-body">
                  <h3 className="list-card-title">{item.title}</h3>
                  <span className={`list-card-status status-${item.status.toLowerCase().replace(/\s+/g, '-')}`}>
                    {item.status}
                  </span>
                </div>
              </Link>
              <div className="list-card-actions">
                {STATUSES.map(s => (
                  <button
                    key={s}
                    className={`action-btn xs ${item.status === s ? 'active' : ''}`}
                    onClick={() => handleStatusChange(item, s)}
                  >{s}</button>
                ))}
                <button
                  className="list-card-remove"
                  onClick={() => handleRemove(item.id)}
                >Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
