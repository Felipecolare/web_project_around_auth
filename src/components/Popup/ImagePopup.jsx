export default function ImagePopup({ card }) {
  return (
    <div className="popup__container popup__container_image">
      <img
        src={card.link}
        alt={card.name}
        className="popup__image"
      />
      <h3 className="popup__image-title">{card.name}</h3>
    </div>
  );
}