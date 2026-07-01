import {useNavigate} from "react-router-dom"

export default function AnimeCard({anime}){
    const navigate = useNavigate()
    return (
        <div className='anime-card' onClick={()=>navigate(`anime/${anime.mal_id}`)}>
            <div className='anime-card-image'>
                <img src={anime.image?.jpg.image_url} 
                alt={anime.title}
                loading="lazy"
                />
                {anime.score && (
                    <span className='anime-card-score'>{anime.score}</span>
                    )}
            </div>
               <div className='anime-card-body'>
                <h3 className='anime-card-title'>{anime.title}</h3>
                <div className='anime-card-info'>
                {anime.episodes && <span>{anime.episodes} eps</span>}
                {anime.year && <span>{anime.year}</span>}
              </div>
            </div>
        </div>
    )
}