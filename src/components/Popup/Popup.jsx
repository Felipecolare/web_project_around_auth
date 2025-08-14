export default function Popup({ title, children, onClose }) {
  return (
    <div className="popup popup_opened">
      <div className="popup__container">
        <button
          className="popup__button-close"
          type="button"
          onClick={onClose}
        ></button>
        <h2 className="popup__title">{title}</h2>
        {children}
      </div>
    </div>
  );
}