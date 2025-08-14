// ===== src/components/Main/Main.jsx =====
import { useAuth } from '../../contexts/AuthContext';
import Card from '../Card/Card';
import Popup from '../Popup/Popup';
import NewCard from '../Popup/NewCard';
import EditProfile from '../Popup/EditProfile';
import EditAvatar from '../Popup/EditAvatar';
import ImagePopup from '../Popup/ImagePopup';

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
  onAddPlaceSubmit,
  onUpdateUser,
  onUpdateAvatar,
}) {
  const { currentUser } = useAuth();

  return (
    <main className="main">
      <section className="profile page__container">
        <div className="profile__info">
          <div className="profile__avatar-container">
            <img
              className="profile__avatar"
              src={currentUser?.avatar || "/src/images/jacques_cousteau.png"}
              alt="Avatar do usuário"
            />
            <button
              className="profile__avatar-edit"
              onClick={() => onOpenPopup('edit-avatar')}
              type="button"
              aria-label="Editar avatar"
            >
              <img
                className="profile__avatar-edit-icon"
                src="/src/images/edit_button.png"
                alt="Ícone de edição"
              />
            </button>
          </div>
          <div className="profile__text">
            <h1 className="profile__name">
              {currentUser?.name || "Jacques Cousteau"}
            </h1>
            <p className="profile__about">
              {currentUser?.about || "Explorador"}
            </p>
            <button
              className="profile__edit-button"
              onClick={() => onOpenPopup('edit-profile')}
              type="button"
              aria-label="Editar perfil"
            >
              <img
                className="profile__edit-icon"
                src="/src/images/edit_button.png"
                alt="Ícone de edição"
              />
            </button>
          </div>
        </div>
        <button
          className="profile__add-button"
          onClick={() => onOpenPopup('new-card')}
          type="button"
          aria-label="Adicionar cartão"
        >
          <img
            className="profile__add-icon"
            src="/src/images/add_button.png"
            alt="Ícone de adição"
          />
        </button>
      </section>

      <section className="cards page__container">
        <ul className="cards__list">
          {cards.map((card) => (
            <Card
              key={card._id}
              card={card}
              onCardLike={onCardLike}
              onCardDelete={onCardDelete}
              onCardClick={onCardClick}
              currentUser={currentUser}
            />
          ))}
        </ul>
      </section>

      {/* Popups */}
      {popup === 'new-card' && (
        <Popup onClose={onClosePopup}>
          <NewCard
            onClose={onClosePopup}
            onSubmit={onAddPlaceSubmit}
            isLoading={isLoading}
          />
        </Popup>
      )}

      {popup === 'edit-profile' && (
        <Popup onClose={onClosePopup}>
          <EditProfile
            onClose={onClosePopup}
            currentUser={currentUser}
            isLoading={isLoading}
            onUpdateUser={onUpdateUser}
          />
        </Popup>
      )}

      {popup === 'edit-avatar' && (
        <div>
          {console.log('🔍 Renderizando popup edit-avatar, popup:', popup)}
          {console.log('🔍 onClosePopup:', onClosePopup)}
          {console.log('🔍 currentUser:', currentUser)}
          <Popup onClose={onClosePopup} className="popup__content_avatar">
            <EditAvatar
              onClose={onClosePopup}
              currentUser={currentUser}
              isLoading={isLoading}
              onSubmit={onUpdateAvatar}
            />
          </Popup>
        </div>
      )}

      {selectedCard && (
        <ImagePopup card={selectedCard} onClose={onClosePopup} />
      )}
    </main>
  );
}