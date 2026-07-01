import { useNavigate } from 'react-router-dom';

export default function CharacterCard({ character, navigateTo }) {
  const navigate = useNavigate();
  const char = character.character || character;

  const handleClick = () => {
    if (navigateTo) {
      navigate(navigateTo);
    } else {
      navigate(`/characters/${char.mal_id}`);
    }
  };

  return (
    <div className="character-card" onClick={handleClick}>
      <div className="character-card-image">
        <img
          src={char.images?.jpg?.image_url}
          alt={char.name}
          loading="lazy"
        />
      </div>
      <div className="character-card-body">
        <h3 className="character-card-name">{char.name}</h3>
        {character.role && (
          <span className="character-card-role">{character.role}</span>
        )}
      </div>
    </div>
  );
}
