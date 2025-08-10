// ===== src/components/Card/Card.jsx =====
import { useAuth } from '../../contexts/AuthContext';

export default function Card(props) {
  const { card, onCardLike, onCardDelete, onCardClick } = props;
  const { currentUser } = useAuth();
  const { name, link, likes, owner } = card;
  
  // Calcular se o cartão é do usuário atual
  const isOwn = owner?._id === currentUser?._id;
  
  // Calcular se o usuário atual curtiu o cartão
  const isLiked = likes?.some(like => like._id === currentUser?._id);
  
  // Classes CSS condicionais para o botão de curtir
  const cardLikeButtonClassName = `card__like-button ${
    isLiked ? 'card__like-button_active' : ''
  }`;

  // Handler para clique no botão de curtir
  function handleLikeClick() {
    onCardLike(card);
  }

  // Handler para clique no botão de deletar
  function handleDeleteClick() {
    onCardDelete(card);
  }

  // Handler para clique na imagem
  function handleImageClick() {
    onCardClick(card);
  }
  
  return (
    <li className="card">
      <img 
        className="card__image" 
        src={link} 
        alt={name}
        onClick={handleImageClick}
      />
      
      {/* Botão de delete só aparece se o cartão for do usuário atual */}
      {isOwn && (
        <button
          aria-label="Delete card"
          className="card__delete-button"
          type="button"
          onClick={handleDeleteClick}
        />
      )}
      
      <div className="card__description">
        <h2 className="card__title">{name}</h2>
        
        <div className="card__like-container">
          <button
            aria-label="Like card"
            type="button"
            className={cardLikeButtonClassName}
            onClick={handleLikeClick}
          />
          {/* Contador de likes */}
          {likes && likes.length > 0 && (
            <span className="card__like-count">{likes.length}</span>
          )}
        </div>
      </div>
    </li>
  );
}