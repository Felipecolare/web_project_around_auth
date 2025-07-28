// ===== src/components/Card/Card.jsx =====
import { useContext } from 'react';
import CurrentUserContext from '../../contexts/CurrentUserContext';

export default function Card(props) {
  const { card, onCardLike, onCardDelete, onCardClick, isOwn, isLiked } = props;
  const { currentUser } = useContext(CurrentUserContext); // Obtém o usuário atual do contexto
  const { name, link, likes } = card;
  
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
          {likes.length > 0 && (
            <span className="card__like-count">{likes.length}</span>
          )}
        </div>
      </div>
    </li>
  );
}