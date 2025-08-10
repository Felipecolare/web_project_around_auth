/* eslint-disable no-undef */
// ===== src/components/Popup/EditProfile.jsx =====
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';

export default function EditProfile({ onClose, currentUser, isLoading: externalLoading }) {
  const { currentUser: authUser } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Usar o usuário do contexto de autenticação ou das props
  const user = currentUser || authUser;

  // Atualizar campos quando user mudar
  useEffect(() => {
    console.log('👤 EditProfile - user mudou:', user);
    
    if (user) {
      const newName = user.name || '';
      const newDescription = user.about || '';
      
      setName(newName);
      setDescription(newDescription);
      setHasChanges(false); // Reset changes quando carrega dados
      
      console.log('📝 Campos preenchidos:', { name: newName, about: newDescription });
    }
  }, [user]);

  const handleNameChange = (event) => {
    const newValue = event.target.value;
    setName(newValue);
    
    // Verificar se houve mudanças
    const hasNameChange = newValue !== (user?.name || '');
    const hasDescriptionChange = description !== (user?.about || '');
    setHasChanges(hasNameChange || hasDescriptionChange);
    
    console.log('📝 Nome alterado:', newValue, 'Tem mudanças:', hasNameChange || hasDescriptionChange);
  };

  const handleDescriptionChange = (event) => {
    const newValue = event.target.value;
    setDescription(newValue);
    
    // Verificar se houve mudanças
    const hasNameChange = name !== (user?.name || '');
    const hasDescriptionChange = newValue !== (user?.about || '');
    setHasChanges(hasNameChange || hasDescriptionChange);
    
    console.log('📝 Descrição alterada:', newValue, 'Tem mudanças:', hasNameChange || hasDescriptionChange);
  };

  const handleSubmit = async (event) => {
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
      name: user?.name, 
      about: user?.about 
    });

    setIsLoading(true);
    try {
      // Atualiza as informações do usuário via API
      await api.setUserInfo(dataToSend);
      console.log('✅ Perfil atualizado com sucesso');
      onClose();
    } catch (error) {
      console.error('❌ Erro ao atualizar perfil:', error);
      alert('Erro ao atualizar perfil. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const finalLoading = isLoading || externalLoading;

  // Log para debug
  console.log('🔄 EditProfile render:', {
    user: user?.name || 'Não carregado',
    name,
    description,
    hasChanges,
    isLoading: finalLoading
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
          disabled={finalLoading}
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
          disabled={finalLoading}
        />
        <span className="popup__error" id="profile-about-error"></span>
      </label>

      <button 
        className={`button popup__button ${finalLoading || !hasChanges ? 'popup__button_disabled' : ''}`} 
        type="submit"
        disabled={finalLoading || !hasChanges}
        title={!hasChanges ? 'Nenhuma alteração foi feita' : ''}
      >
        {finalLoading ? 'Salvando...' : 'Salvar'}
      </button>
      
      {/* Debug info - remover em produção */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{fontSize: '12px', color: '#666', marginTop: '10px'}}>
          Debug: {hasChanges ? '✅ Há alterações' : '❌ Sem alterações'} 
          {finalLoading && ' | 🔄 Salvando...'}
        </div>
      )}
    </form>
  );
}