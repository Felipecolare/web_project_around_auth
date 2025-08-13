// ===== src/components/Popup/ImagePopup.jsx =====
export default function ImagePopup({ card, onClose }) {
  return (
    <div className="popup popup_type_image">
      <div className="popup__content popup__content_content_image">
        <button
          aria-label="Close modal"
          className="popup__close"
          type="button"
          onClick={onClose}
        />
        <div className="popup__image-container">
          <img
            className="popup__image"
            src={card?.link}
            alt={card?.name}
          />
        </div>
        <p className="popup__caption">{card?.name}</p>
      </div>
    </div>
  );
}