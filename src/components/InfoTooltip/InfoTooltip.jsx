// ===== src/components/InfoTooltip/InfoTooltip.jsx =====
export default function InfoTooltip({ isOpen, onClose, isSuccess, message }) {
  if (!isOpen) return null;

  const iconClass = isSuccess 
    ? 'info-tooltip__icon info-tooltip__icon_success' 
    : 'info-tooltip__icon info-tooltip__icon_error';

  const defaultMessage = isSuccess 
    ? 'Vitória! Você foi registrado com sucesso.'
    : 'Ops, algo deu errado! Por favor, tente novamente.';

  return (
    <div className="popup info-tooltip">
      <div className="popup__content info-tooltip__content">
        <button
          aria-label="Close modal"
          className="popup__close"
          type="button"
          onClick={onClose}
        />
        
        <div className="info-tooltip__container">
          <div className={iconClass}></div>
          <p className="info-tooltip__message">
            {message || defaultMessage}
          </p>
        </div>
      </div>
    </div>
  );
}