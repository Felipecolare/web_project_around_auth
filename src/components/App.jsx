// ===== src/components/App.jsx =====
import { useState, useEffect } from "react";
import Header from "./Header/Header.jsx";
import Main from "./Main/Main.jsx";
import Footer from "./Footer/Footer.jsx";
import api from "../utils/api.js";
import CurrentUserContext from "../contexts/CurrentUserContext";

function App() {
  // Estado para armazenar os dados do usuário atual
  const [currentUser, setCurrentUser] = useState({});
  
  // Estados dos cartões (elevados do Main)
  const [cards, setCards] = useState([]);
  
  // Estados dos popups (elevados do Main)
  const [popup, setPopup] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Estado para controlar se houve erro de autenticação
  const [authError, setAuthError] = useState(false);

  // Cartões de exemplo caso a API falhe
  const fallbackCards = [
    {
      _id: "1",
      name: "Vale de Yosemite",
      link: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
      owner: { _id: "default-user" },
      likes: [{ _id: "user1" }, { _id: "user2" }]
    },
    {
      _id: "2", 
      name: "Lago Louise",
      link: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
      owner: { _id: "default-user" },
      likes: [{ _id: "user1" }]
    },
    {
      _id: "3",
      name: "Gatinho",
      link: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
      owner: { _id: "default-user" },
      likes: []
    }
  ];

  // Função para tratar erros de autenticação
  const handleAuthError = (error) => {
    if (error.includes('Token expirado') || error.includes('autenticação') || error.includes('401')) {
      console.error('🔑 Erro de autenticação detectado:', error);
      setAuthError(true);
      alert('Sua sessão expirou. Por favor, atualize o token de autenticação ou faça login novamente.');
      return true;
    }
    return false;
  };

  // Buscar informações do usuário quando o componente montar
  useEffect(() => {
    console.log('🚀 Iniciando carregamento do usuário...');
    
    api.getUserInfo()
      .then((userData) => {
        console.log('✅ Dados do usuário carregados:', userData);
        setCurrentUser(userData);
        setAuthError(false); // Reset auth error se conseguiu carregar
      })
      .catch((err) => {
        console.error('❌ Erro ao buscar dados do usuário:', err);
        
        if (!handleAuthError(err)) {
          // Se não é erro de auth, usar fallback
          setCurrentUser({
            name: "Jacques Cousteau",
            about: "Explorador",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
            _id: "default-user"
          });
        }
      });
  }, []);

  // Carregar cartões iniciais
  useEffect(() => {
    console.log('🃏 Iniciando carregamento de cartões...');
    
    api.getInitialCards()
      .then((cardsData) => {
        console.log('✅ Cartões carregados:', cardsData);
        setCards(cardsData);
        setAuthError(false); // Reset auth error se conseguiu carregar
      })
      .catch((err) => {
        console.error('❌ Erro ao carregar cartões:', err);
        
        if (!handleAuthError(err)) {
          // Se não é erro de auth, usar fallback
          setCards(fallbackCards);
        }
      });
  }, []);

  // Função para atualizar informações do usuário
  const handleUpdateUser = (data) => {
    setIsLoading(true);
    
    console.log('🔄 Atualizando usuário:', data);
    
    api.setUserInfo(data)
      .then((newData) => {
        console.log('✅ Usuário atualizado com sucesso:', newData);
        setCurrentUser(newData);
        handleClosePopup();
        setAuthError(false);
      })
      .catch((error) => {
        console.error('❌ Erro ao atualizar usuário:', error);
        
        if (!handleAuthError(error)) {
          alert('Erro ao salvar alterações. Verifique sua conexão e tente novamente.');
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Função para atualizar avatar do usuário
  const handleUpdateAvatar = (data) => {
    setIsLoading(true);
    
    console.log('🔄 Atualizando avatar:', data);
    
    api.setUserAvatar(data)
      .then((newData) => {
        console.log('✅ Avatar atualizado com sucesso:', newData);
        setCurrentUser(newData);
        handleClosePopup();
        setAuthError(false);
      })
      .catch((error) => {
        console.error('❌ Erro ao atualizar avatar:', error);
        
        if (!handleAuthError(error)) {
          alert('Erro ao atualizar avatar. Verifique a URL da imagem e tente novamente.');
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Função para curtir/descurtir cartão
  const handleCardLike = (card) => {
    // Verificar se há erro de autenticação ativo
    if (authError) {
      alert('Sua sessão expirou. Atualize a página e faça login novamente.');
      return;
    }
    
    const isLiked = card.likes.some(like => like._id === currentUser._id);
    
    console.log('🔄 Alterando like do cartão:', card.name, isLiked ? 'descurtir' : 'curtir');
    
    api.changeLikeCardStatus(card._id, isLiked)
      .then((newCard) => {
        console.log('✅ Like atualizado:', newCard);
        setCards((state) => 
          state.map((currentCard) => 
            currentCard._id === card._id ? newCard : currentCard
          )
        );
        setAuthError(false);
      })
      .catch((error) => {
        console.error('❌ Erro ao curtir cartão:', error);
        
        if (!handleAuthError(error)) {
          // Para likes, podemos manter a simulação local como fallback
          setCards((state) => 
            state.map((currentCard) => {
              if (currentCard._id === card._id) {
                const newLikes = isLiked 
                  ? currentCard.likes.filter(like => like._id !== currentUser._id)
                  : [...currentCard.likes, { _id: currentUser._id }];
                return { ...currentCard, likes: newLikes };
              }
              return currentCard;
            })
          );
        }
      });
  };

  // Função para deletar cartão
  const handleCardDelete = (card) => {
    // Verificar se há erro de autenticação ativo
    if (authError) {
      alert('Sua sessão expirou. Atualize a página e faça login novamente.');
      return;
    }
    
    console.log('🔄 Deletando cartão:', card.name);
    
    api.deleteCard(card._id)
      .then(() => {
        console.log('✅ Cartão deletado com sucesso');
        setCards((state) => 
          state.filter((currentCard) => currentCard._id !== card._id)
        );
        setAuthError(false);
      })
      .catch((error) => {
        console.error('❌ Erro ao deletar cartão:', error);
        
        if (!handleAuthError(error)) {
          alert('Erro ao deletar cartão. Tente novamente.');
        }
      });
  };

  // Função para adicionar novo cartão
  const handleAddPlaceSubmit = (cardData) => {
    // Verificar se há erro de autenticação ativo
    if (authError) {
      alert('Sua sessão expirou. Atualize a página e faça login novamente.');
      return;
    }
    
    setIsLoading(true);
    
    console.log('🔄 Adicionando novo cartão:', cardData);
    
    api.addCard(cardData)
      .then((newCard) => {
        console.log('✅ Cartão adicionado com sucesso:', newCard);
        setCards([newCard, ...cards]);
        handleClosePopup();
        setAuthError(false);
      })
      .catch((err) => {
        console.error('❌ Erro ao adicionar cartão:', err);
        
        if (!handleAuthError(err)) {
          alert('Erro ao adicionar cartão. Verifique a URL da imagem e tente novamente.');
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Função para abrir popup
  const handleOpenPopup = (popupData) => {
    // Verificar se há erro de autenticação ativo
    if (authError) {
      alert('Sua sessão expirou. Atualize a página e faça login novamente.');
      return;
    }
    
    setPopup(popupData);
  };
  
  // Função para fechar popup
  const handleClosePopup = () => {
    setPopup(null);
    setSelectedCard(null);
  };

  // Função para abrir imagem
  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  return (
    <CurrentUserContext.Provider value={{ 
      currentUser, 
      handleUpdateUser, 
      handleUpdateAvatar 
    }}>
      <div className="page">
        {authError && (
          <div style={{
            backgroundColor: '#ff4444',
            color: 'white',
            padding: '10px',
            textAlign: 'center',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000
          }}>
            ⚠️ Sua sessão expirou. Atualize a página e faça login novamente.
          </div>
        )}
        <Header />
        <Main 
          cards={cards}
          onCardLike={handleCardLike}
          onCardDelete={handleCardDelete}
          onCardClick={handleCardClick}
          onOpenPopup={handleOpenPopup}
          onClosePopup={handleClosePopup}
          popup={popup}
          selectedCard={selectedCard}
          isLoading={isLoading}
          onAddPlaceSubmit={handleAddPlaceSubmit}
        />
        <Footer />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;