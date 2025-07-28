/* eslint-disable no-undef */
// ===== src/components/Popup/EditProfile.jsx =====
import { useState, useContext, useEffect } from 'react';
import CurrentUserContext from '../../contexts/CurrentUserContext';

export default function EditProfile({ isLoading }) {
  const { currentUser, handleUpdateUser } = useContext(CurrentUserContext);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  // Atualizar campos quando currentUser mudar
  useEffect(() => {
    console.log('👤 EditProfile - currentUser mudou:', currentUser);
    
    if (currentUser) {
      const newName = currentUser.name || '';
      const newDescription = currentUser.about || '';
      
      setName(newName);
      setDescription(newDescription);
      setHasChanges(false); // Reset changes quando carrega dados
      
      console.log('📝 Campos preenchidos:', { name: newName, about: newDescription });
    }
  }, [currentUser]);

  const handleNameChange = (event) => {
    const newValue = event.target.value;
    setName(newValue);
    
    // Verificar se houve mudanças
    const hasNameChange = newValue !== (currentUser.name || '');
    const hasDescriptionChange = description !== (currentUser.about || '');
    setHasChanges(hasNameChange || hasDescriptionChange);
    
    console.log('📝 Nome alterado:', newValue, 'Tem mudanças:', hasNameChange || hasDescriptionChange);
  };

  const handleDescriptionChange = (event) => {
    const newValue = event.target.value;
    setDescription(newValue);
    
    // Verificar se houve mudanças
    const hasNameChange = name !== (currentUser.name || '');
    const hasDescriptionChange = newValue !== (currentUser.about || '');
    setHasChanges(hasNameChange || hasDescriptionChange);
    
    console.log('📝 Descrição alterada:', newValue, 'Tem mudanças:', hasNameChange || hasDescriptionChange);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validação básica
    if (!name.trim()) {
      alert('Por favor, preencha o nome.');
      return;
    }

    if (!description.trim()) {
      alert('Por favor, preencha a descrição.');
      return;
    }

    // Verificar se realmente houve mudanças
    if (!hasChanges) {
      alert('Nenhuma alteração foi feita.');
      return;
    }

    const dataToSend = { 
      name: name.trim(), 
      about: description.trim() 
    };

    console.log('📤 Enviando dados do perfil:', dataToSend);
    console.log('📊 Dados originais:', { 
      name: currentUser.name, 
      about: currentUser.about 
    });

    // Atualiza as informações do usuário
    handleUpdateUser(dataToSend);
  };

  // Log para debug
  console.log('🔄 EditProfile render:', {
    currentUser: currentUser?.name || 'Não carregado',
    name,
    description,
    hasChanges,
    isLoading
  });

  return (
    <form
      className="popup__form"
      name="profile-form"
      id="edit-profile-form"
      onSubmit={handleSubmit}
    >
      <label className="popup__field">
        <input
          className="popup__input popup__input_type_name"
          id="profile-name"
          maxLength="40"
          minLength="2"
          name="name"
          placeholder="Nome"
          required
          type="text"
          value={name}
          onChange={handleNameChange}
          disabled={isLoading}
        />
        <span className="popup__error" id="profile-name-error"></span>
      </label>
      
      <label className="popup__field">
        <input
          className="popup__input popup__input_type_about"
          id="profile-about"
          maxLength="200"
          minLength="2"
          name="about"
          placeholder="Sobre mim"
          required
          type="text"
          value={description}
          onChange={handleDescriptionChange}
          disabled={isLoading}
        />
        <span className="popup__error" id="profile-about-error"></span>
      </label>

      <button 
        className={`button popup__button ${isLoading || !hasChanges ? 'popup__button_disabled' : ''}`} 
        type="submit"
        disabled={isLoading || !hasChanges}
        title={!hasChanges ? 'Nenhuma alteração foi feita' : ''}
      >
        {isLoading ? 'Salvando...' : 'Salvar'}
      </button>
      
      {/* Debug info - remover em produção */}
      // eslint-disable-next-line no-undef
      {process.env.NODE_ENV === 'development' && (
        <div style={{fontSize: '12px', color: '#666', marginTop: '10px'}}>
          Debug: {hasChanges ? '✅ Há alterações' : '❌ Sem alterações'} 
          {isLoading && ' | 🔄 Salvando...'}
        </div>
      )}
    </form>
  );
}