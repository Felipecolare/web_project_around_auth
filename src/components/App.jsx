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
  const { currentUser, isAuthenticated } = useAuth();

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
      const cardsData = await api.getInitialCards();
      setCards(cardsData);
      console.log("✅ Cartões carregados:", cardsData);
    } catch (error) {
      console.error("❌ Erro ao carregar cartões:", error);
      // Em caso de erro, usar cartões padrão
      setCards([
        {
          _id: "1",
          name: "Vale de Yosemite",
          link: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
          owner: { _id: currentUser?._id || "default-user" },
          likes: []
        },
        {
          _id: "2",
          name: "Lago Louise",
          link: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
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
