const JSON_SERVER = 'http://localhost:3001'

export async function getFavorites() {
  const res = await fetch(`${JSON_SERVER}/favorites`)
  if (!res.ok) throw new Error('Failed to fetch favorites')
  return res.json()
}

export async function addFavorite(anime) {
  const res = await fetch(`${JSON_SERVER}/favorites`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      animeId: anime.mal_id,
      title: anime.title,
      image: anime.images?.jpg?.image_url,
      score: anime.score
    })
  })
  if (!res.ok) throw new Error('Failed to add favorite')
  return res.json()
}

export async function removeFavorite(id) {
  const res = await fetch(`${JSON_SERVER}/favorites/${id}`, {
    method: 'DELETE'
  })
  if (!res.ok) throw new Error('Failed to remove favorite')
  return res.json()
}

export async function getRatings() {
  const res = await fetch(`${JSON_SERVER}/ratings`)
  if (!res.ok) throw new Error('Failed to fetch ratings')
  return res.json()
}

export async function upsertRating(animeId, score, note) {
  const all = await getRatings()
  const existing = all.find(r => r.animeId === animeId)

  if (existing) {
    const res = await fetch(`${JSON_SERVER}/ratings/${existing.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ animeId, score, note })
    })
    if (!res.ok) throw new Error('Failed to update rating')
    return res.json()
  } else {
    const res = await fetch(`${JSON_SERVER}/ratings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ animeId, score, note })
    })
    if (!res.ok) throw new Error('Failed to create rating')
    return res.json()
  }
}

export async function deleteRating(id) {
  const res = await fetch(`${JSON_SERVER}/ratings/${id}`, {
    method: 'DELETE'
  })
  if (!res.ok) throw new Error('Failed to delete rating')
  return res.json()
}

export async function getLibrary() {
  const res = await fetch(`${JSON_SERVER}/library`)
  if (!res.ok) throw new Error('Failed to fetch library')
  return res.json()
}

export async function addToLibrary(animeId, title, image, status) {
  const res = await fetch(`${JSON_SERVER}/library`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ animeId, title, image, status })
  })
  if (!res.ok) throw new Error('Failed to add to library')
  return res.json()
}

export async function updateLibraryItem(id, status) {
  const res = await fetch(`${JSON_SERVER}/library/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  })
  if (!res.ok) throw new Error('Failed to update library item')
  return res.json()
}

export async function removeFromLibrary(id) {
  const res = await fetch(`${JSON_SERVER}/library/${id}`, {
    method: 'DELETE'
  })
  if (!res.ok) throw new Error('Failed to remove from library')
  return res.json()
}
