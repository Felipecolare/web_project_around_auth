// ===== src/components/Popup/EditAvatar.jsx =====
import { useRef, useContext } from 'react';
import CurrentUserContext from '../../contexts/CurrentUserContext';

export default function EditAvatar({ isLoading }) {
  const { handleUpdateAvatar } = useContext(CurrentUserContext);
  const avatarRef = useRef();

  function handleSubmit(e) {
    e.preventDefault();
    
    const avatarUrl = avatarRef.current.value.trim();
    
    // Validação básica
    if (!avatarUrl) {
      alert('Por favor, insira o link da imagem.');
      return;
    }

    // Validação de URL básica
    try {
      new URL(avatarUrl);
    } catch {
      alert('Por favor, insira uma URL válida para a imagem.');
      return;
    }

    console.log('📝 Enviando novo avatar:', avatarUrl);

    // Enviar dados para o contexto usando o valor da entrada obtido com ref
    handleUpdateAvatar({
      avatar: avatarUrl,
    });
  }

  return (
    <form
      className="popup__form"
      name="avatar-form"
      id="edit-avatar-form"
      onSubmit={handleSubmit}
    >
      <label className="popup__field">
        <input
          className="popup__input popup__input_type_avatar"
          id="avatar-link"
          name="avatar"
          placeholder="Link da imagem"
          required
          type="url"
          ref={avatarRef}
          disabled={isLoading}
        />
        <span className="popup__error" id="avatar-link-error"></span>
      </label>

      <button 
        className={`button popup__button ${isLoading ? 'popup__button_disabled' : ''}`} 
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? 'Salvando...' : 'Salvar'}
      </button>
    </form>
  );
}