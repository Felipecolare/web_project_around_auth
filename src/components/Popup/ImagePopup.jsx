export default function ImagePopup({ card, onClose }) {
  return (
    <div className="popup popup_opened">
      <div className="popup__container popup__container_image">
        <button
          className="popup__button-close"
          type="button"
          onClick={onClose}
        ></button>
        <img
          src={card.link}
          alt={card.name}
          className="popup__image"
        />
        <h3 className="popup__image-title">{card.name}</h3>
      </div>
    </div>
  );
}