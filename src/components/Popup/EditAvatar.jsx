// ===== src/components/Popup/EditAvatar.jsx =====
import { useRef, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';

export default function EditAvatar({ onClose, isLoading: externalLoading }) {
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const avatarRef = useRef();

  // Log para debug
  console.log('🔍 EditAvatar renderizado:', { onClose, externalLoading, currentUser });

  async function handleSubmit(e) {
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

    setIsLoading(true);
    try {
      // Atualizar avatar via API
      await api.setUserAvatar({ avatar: avatarUrl });
      console.log('✅ Avatar atualizado com sucesso');
      onClose();
    } catch (error) {
      console.error('❌ Erro ao atualizar avatar:', error);
      alert('Erro ao atualizar avatar. Verifique a URL da imagem e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }

  const finalLoading = isLoading || externalLoading;

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
          disabled={finalLoading}
        />
        <span className="popup__error" id="avatar-link-error"></span>
      </label>

      <button 
        className={`button popup__button ${finalLoading ? 'popup__button_disabled' : ''}`} 
        type="submit"
        disabled={finalLoading}
      >
        {finalLoading ? 'Salvando...' : 'Salvar'}
      </button>
    </form>
  );
}