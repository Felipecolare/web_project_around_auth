// ===== src/components/Main/Main.jsx =====
import { useContext, useRef } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";
import Popup from "../Popup/Popup.jsx";
import ImagePopup from "../Popup/ImagePopup.jsx";
import EditProfile from "../Popup/EditProfile.jsx";
import EditAvatar from "../Popup/EditAvatar.jsx";
import NewCard from "../Popup/NewCard.jsx";
import Card from "../Card/Card.jsx";

export default function Main({
  cards,
  onCardLike,
  onCardDelete,
  onCardClick,
  onOpenPopup,
  onClosePopup,
  popup,
  selectedCard,
  isLoading,
  onAddPlaceSubmit
}) {
  // Obter o usuário atual do contexto
  const { currentUser } = useContext(CurrentUserContext);
  
  // Ref para acessar o componente NewCard
  const newCardRef = useRef();

  // Função modificada para limpar formulário ao fechar popup
  const handleClosePopup = () => {
    // Se estivermos fechando o popup de novo cartão, limpar o formulário
    if (popup?.title === "Novo lugar" && newCardRef.current) {
      // Limpar campos do formulário
      const form = document.getElementById('new-card-form');
      if (form) {
        form.reset();
      }
    }
    
    onClosePopup();
  };

  // Objetos de popup
  const newCardPopup = { 
    title: "Novo lugar", 
    children: <NewCard ref={newCardRef} onAddPlaceSubmit={onAddPlaceSubmit} isLoading={isLoading} /> 
  };
  const editProfilePopup = { 
    title: "Editar perfil", 
    children: <EditProfile isLoading={isLoading} /> 
  };
  const editAvatarPopup = { 
    title: "Alterar a foto do perfil", 
    children: <EditAvatar isLoading={isLoading} /> 
  };

  return (
    <main className="page__container">
      <section className="profile">
        <div className="profile__card-image">
          <img
            src={currentUser.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"}
            alt={currentUser.name || "Usuário"}
            className="profile__image"
            onClick={() => onOpenPopup(editAvatarPopup)}
            title="Alterar a foto do perfil"
          />
        </div>
        <div className="profile__card">
          <h2 className="profile__title">{currentUser.name || "Jacques Cousteau"}</h2>
          <button 
            type="button" 
            className="profile__button-edit"
            onClick={() => onOpenPopup(editProfilePopup)}
          ></button>
          <p className="profile__subtitle">{currentUser.about || "Explorador"}</p>
        </div>

        <button 
          type="button" 
          className="profile__button-add"
          onClick={() => onOpenPopup(newCardPopup)}
        ></button>
      </section>

      <ul className="cards__list">
        {cards.map((card) => (
          <Card 
            key={card._id} 
            card={card} 
            onCardLike={onCardLike}
            onCardDelete={onCardDelete}
            onCardClick={onCardClick}
            isOwn={card.owner._id === currentUser._id}
            isLiked={card.likes.some(like => like._id === currentUser._id)}
          />
        ))}
      </ul>

      {/* Renderização condicional do popup */}
      {popup && (
        <Popup onClose={handleClosePopup} title={popup.title}>
          {popup.children}
        </Popup>
      )}

      {/* Popup de imagem */}
      {selectedCard && (
        <ImagePopup card={selectedCard} onClose={onClosePopup} />
      )}
    </main>
  );
}