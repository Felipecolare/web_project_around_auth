// ===== src/components/Popup/NewCard.jsx =====
import { useState, useEffect } from 'react';

export default function NewCard({ onClose, onSubmit, isLoading }) {
  const [name, setName] = useState('');
  const [link, setLink] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  // Verificar se o formulário é válido
  useEffect(() => {
    const nameValid = name.trim().length >= 1;
    const linkValid = link.trim().length > 0 && isValidUrl(link.trim());
    const formValid = nameValid && linkValid;
    
    setIsFormValid(formValid);
    
    console.log('🔍 Validação do formulário:', {
      name: nameValid ? '✅' : '❌',
      link: linkValid ? '✅' : '❌',
      isValid: formValid
    });
  }, [name, link]);

  // Função para validar URL
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  const handleNameChange = (event) => {
    const newValue = event.target.value;
    setName(newValue);
    console.log('📝 Nome do cartão alterado:', newValue);
  };

  const handleLinkChange = (event) => {
    const newValue = event.target.value;
    setLink(newValue);
    console.log('🔗 Link alterado:', newValue);
    
    if (newValue.trim()) {
      const valid = isValidUrl(newValue.trim());
      console.log('🔍 URL válida:', valid ? '✅' : '❌');
    }
  };

  function handleSubmit(e) {
    e.preventDefault();
    
    const trimmedName = name.trim();
    const trimmedLink = link.trim();
    
    // Validação básica
    if (!trimmedName) {
      alert('Por favor, preencha o título do cartão.');
      return;
    }

    if (!trimmedLink) {
      alert('Por favor, preencha o link da imagem.');
      return;
    }

    // Validação de URL
    if (!isValidUrl(trimmedLink)) {
      alert('Por favor, insira uma URL válida para a imagem.\nExemplo: https://exemplo.com/imagem.jpg');
      return;
    }

    const cardData = {
      name: trimmedName,
      link: trimmedLink,
    };

    console.log('📤 Enviando dados do cartão:', cardData);

    // Enviar dados para o App através da prop onAddPlaceSubmit
    onSubmit(cardData);

    // IMPORTANTE: NÃO limpar formulário aqui
    // O formulário só deve ser limpo quando o popup for fechado com sucesso
  }

  // Função para limpar formulário (chamada quando popup é fechado com sucesso)
  const resetForm = () => {
    console.log('🧹 Limpando formulário do novo cartão');
    setName('');
    setLink('');
    setIsFormValid(false);
  };

  // Log para debug
  console.log('🔄 NewCard render:', {
    name,
    link,
    isFormValid,
    isLoading
  });

  return (
    <form
      className="popup__form"
      name="card-form"
      id="new-card-form"
      onSubmit={handleSubmit}
    >
      <label className="popup__field">
        <input
          className="popup__input popup__input_type_card-name"
          id="card-name"
          maxLength="30"
          minLength="1"
          name="card-name"
          placeholder="Título"
          required
          type="text"
          value={name}
          onChange={handleNameChange}
          disabled={isLoading}
        />
        <span className="popup__error" id="card-name-error">
          {name.trim().length === 0 && name.length > 0 ? 'Título não pode estar vazio' : ''}
        </span>
      </label>
      
      <label className="popup__field">
        <input
          className="popup__input popup__input_type_url"
          id="card-link"
          name="link"
          placeholder="Link da imagem (https://...)"
          required
          type="url"
          value={link}
          onChange={handleLinkChange}
          disabled={isLoading}
        />
        <span className="popup__error" id="card-link-error">
          {link.trim().length > 0 && !isValidUrl(link.trim()) ? 'URL inválida' : ''}
        </span>
      </label>

      <button 
        className={`button popup__button ${isLoading || !isFormValid ? 'popup__button_disabled' : ''}`} 
        type="submit"
        disabled={isLoading || !isFormValid}
        title={!isFormValid ? 'Preencha todos os campos corretamente' : ''}
      >
        {isLoading ? 'Criando...' : 'Criar'}
      </button>
      
      {/* Debug info - remover em produção */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{fontSize: '12px', color: '#666', marginTop: '10px'}}>
          Debug: {isFormValid ? '✅ Formulário válido' : '❌ Formulário inválido'} 
          {isLoading && ' | 🔄 Criando...'}
        </div>
      )}
    </form>
  );
}