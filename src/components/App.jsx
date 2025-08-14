import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./Header/Header.jsx";
import Main from "./Main/Main.jsx";
import Footer from "./Footer/Footer.jsx";
import Login from "./Auth/Login.jsx";
import Register from "./Auth/Register.jsx";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute.jsx";
import { AuthProvider, useAuth } from "../contexts/AuthContext.jsx";
import api from "../utils/api.js";

// Componente principal da aplicação (protegido)
function AppContent() {
  const [cards, setCards] = useState([]);
  const [popup, setPopup] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser, isAuthenticated, updateUser } = useAuth();

  console.log('🏠 AppContent - Auth Status:', { isAuthenticated, currentUser: currentUser ? 'Presente' : 'Ausente' });

  // Carregar cartões quando o usuário estiver autenticado
  useEffect(() => {
    console.log('🔄 useEffect - Verificando se deve carregar cartões:', { isAuthenticated, currentUser: currentUser ? 'Presente' : 'Ausente' });
    if (isAuthenticated && currentUser) {
      console.log('✅ Carregando cartões...');
      loadCards();
    } else {
      console.log('❌ Não carregando cartões - usuário não autenticado ou dados não disponíveis');
    }
  }, [isAuthenticated, currentUser]); // Dependências para recarregar quando mudar

  const loadCards = async () => {
    try {
      setIsLoading(true);
      console.log("🔄 Iniciando carregamento de cartões...");
      
      // Se não há usuário autenticado, usar cartões padrão
      if (!currentUser) {
        console.log("ℹ️ Usuário não autenticado, usando cartões padrão");
        setCards([
          {
            _id: "1",
            name: "Vale de Yosemite",
            link: "/src/images/vale_yosemite.png",
            owner: { _id: "default-user" },
            likes: []
          },
          {
            _id: "2",
            name: "Lago Louise",
            link: "/src/images/lago_louise.png",
            owner: { _id: "default-user" },
            likes: []
          },
          {
            _id: "3",
            name: "Montanhas Carpathian",
            link: "/src/images/montanhas_care.png",
            owner: { _id: "default-user" },
            likes: []
          },
          {
            _id: "4",
            name: "Latemar",
            link: "/src/images/latemar.png",
            owner: { _id: "default-user" },
            likes: []
          },
          {
            _id: "5",
            name: "Parque Nacional",
            link: "/src/images/parque_nacional.png",
            owner: { _id: "default-user" },
            likes: []
          },
          {
            _id: "6",
            name: "Lago di Braies",
            link: "/src/images/lago_di_braies.png",
            owner: { _id: "default-user" },
            likes: []
          }
        ]);
        return;
      }
      
      // Se há usuário autenticado, tentar carregar da API
      console.log("🔑 Usuário autenticado, tentando carregar cartões da API...");
      const cardsData = await api.getInitialCards();
      setCards(cardsData);
      console.log("✅ Cartões carregados da API:", cardsData);
    } catch (error) {
      console.error("❌ Erro ao carregar cartões da API, usando padrão:", error);
      
      // Verificar se é erro de compatibilidade entre APIs
      if (error.includes('Token') || error.includes('401') || error.includes('403')) {
        console.warn("🔐 POSSÍVEL PROBLEMA: Token da API de auth pode não ser compatível com API principal");
        console.warn("🔧 Solução: Verificar se ambas APIs aceitam o mesmo formato de token");
      }
      
      // Em caso de erro, usar cartões padrão
      setCards([
        {
          _id: "1",
          name: "Vale de Yosemite",
          link: "/src/images/vale_yosemite.png",
          owner: { _id: currentUser?._id || "default-user" },
          likes: []
        },
        {
          _id: "2",
          name: "Lago Louise",
          link: "/src/images/lago_louise.png",
          owner: { _id: currentUser?._id || "default-user" },
          likes: []
        },
        {
          _id: "3",
          name: "Montanhas Carpathian",
          link: "/src/images/montanhas_care.png",
          owner: { _id: currentUser?._id || "default-user" },
          likes: []
        },
        {
          _id: "4",
          name: "Latemar",
          link: "/src/images/latemar.png",
          owner: { _id: currentUser?._id || "default-user" },
          likes: []
        },
        {
          _id: "5",
          name: "Parque Nacional",
          link: "/src/images/parque_nacional.png",
          owner: { _id: currentUser?._id || "default-user" },
          likes: []
        },
        {
          _id: "6",
          name: "Lago di Braies",
          link: "/src/images/lago_di_braies.png",
          owner: { _id: currentUser?._id || "default-user" },
          likes: []
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateUser = async (data) => {
    setIsLoading(true);
    try {
      const newData = await api.setUserInfo(data);
      console.log("✅ Usuário atualizado com sucesso:", newData);
      
      // Atualizar o usuário no contexto
      if (newData && newData.data) {
        // Atualizar o usuário no contexto
        updateUser({
          ...currentUser,
          name: newData.data.name,
          about: newData.data.about
        });
      }
      
      handleClosePopup();
    } catch (error) {
      console.error("❌ Erro ao atualizar usuário:", error);
      alert("Erro ao salvar alterações. Verifique sua conexão e tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateAvatar = async (data) => {
    setIsLoading(true);
    try {
      const newData = await api.setUserAvatar(data);
      console.log("✅ Avatar atualizado com sucesso:", newData);
      
      // Atualizar o usuário no contexto
      if (newData && newData.data) {
        updateUser({
          ...currentUser,
          avatar: newData.data.avatar
        });
      }
      
      handleClosePopup();
    } catch (error) {
      console.error("❌ Erro ao atualizar avatar:", error);
      alert("Erro ao atualizar avatar. Verifique a URL da imagem e tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardLike = async (card) => {
    try {
      const isLiked = card.likes?.some((like) => like._id === currentUser?._id);
      const newCard = await api.changeLikeCardStatus(card._id, isLiked);
      setCards((state) => state.map((c) => (c._id === card._id ? newCard : c)));
      console.log("✅ Like atualizado:", newCard);
    } catch (error) {
      console.error("❌ Erro ao curtir cartão:", error);
      alert("Erro ao curtir cartão. Tente novamente.");
    }
  };

  const handleCardDelete = async (card) => {
    try {
      await api.deleteCard(card._id);
      setCards((state) => state.filter((c) => c._id !== card._id));
      console.log("✅ Cartão deletado com sucesso");
    } catch (error) {
      console.error("❌ Erro ao deletar cartão:", error);
      alert("Erro ao deletar cartão. Tente novamente.");
    }
  };

  const handleAddPlaceSubmit = async (cardData) => {
    setIsLoading(true);
    try {
      const newCard = await api.addCard(cardData);
      setCards([newCard, ...cards]);
      handleClosePopup();
      console.log("✅ Cartão adicionado com sucesso:", newCard);
    } catch (error) {
      console.error("❌ Erro ao adicionar cartão:", error);
      alert("Erro ao adicionar cartão. Verifique a URL da imagem e tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenPopup = (popupType) => {
    setPopup(popupType);
  };

  const handleClosePopup = () => {
    setPopup(null);
    setSelectedCard(null);
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  return (
    <div className="page">
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
        onUpdateUser={handleUpdateUser}
        onUpdateAvatar={handleUpdateAvatar}
      />
      <Footer />
    </div>
  );
}

// Componente principal com roteamento
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Routes>
            {/* Rotas públicas */}
            <Route path="/signin" element={<Login />} />
            <Route path="/signup" element={<Register />} />
            
            {/* Rota protegida principal */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <AppContent />
                </ProtectedRoute>
              } 
            />
            
            {/* Redirecionar rotas não encontradas para a página principal */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
