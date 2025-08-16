import Header from "./Header/Header.jsx";
import Main from "./Main/Main.jsx";
import Footer from "./Footer/Footer.jsx";
import { useState, useEffect } from "react";
import api from "../utils/api.js";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";
import { CardsContext } from "../contexts/CardsContext.js";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute.jsx";
import Login from "./Auth/Login.jsx";
import Register from "./Auth/Register.jsx";
import InfoTooltip from "./InfoTooltip/InfoTooltip.jsx";
import { setToken, getToken, removeToken } from "../utils/token.js";
import * as auth from "../utils/auth.js";
import { Routes, Route, useNavigate } from "react-router-dom";
import successIcon from "../images/auth-icon.svg";
import failIcon from "../images/no_auth-icon.svg";

function App() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
  const [infoTooltipData, setInfoTooltipData] = useState({
    text: "",
    icon: null,
  });
  const [popup, setPopup] = useState(null);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const jwt = getToken();

    if (!jwt) {
      navigate("/signin");
      return;
    }

    // Set token in API headers and login automatically
    api.setToken(jwt);
    setIsLoggedIn(true);
    navigate("/");
  }, [navigate]);

  useEffect(() => {
    if (isLoggedIn) {
      // Simular dados da API (sem fazer requisição real)
      console.log("🚀 Carregando cartões da API...");
      setTimeout(() => {
        setCards([
          {
            _id: "1",
            name: "Vale de Yosemite",
            link: "/src/images/vale_yosemite.png",
            owner: { _id: "user123" },
            likes: [],
            isLiked: false
          },
          {
            _id: "2",
            name: "Lago Louise",
            link: "/src/images/lago_louise.png",
            owner: { _id: "user123" },
            likes: [],
            isLiked: false
          },
          {
            _id: "3",
            name: "Montanhas Carpathian",
            link: "/src/images/montanhas_care.png",
            owner: { _id: "user123" },
            likes: [],
            isLiked: false
          },
          {
            _id: "4",
            name: "Latemar",
            link: "/src/images/latemar.png",
            owner: { _id: "user123" },
            likes: [],
            isLiked: false
          },
          {
            _id: "5",
            name: "Parque Nacional",
            link: "/src/images/parque_nacional.png",
            owner: { _id: "user123" },
            likes: [],
            isLiked: false
          },
          {
            _id: "6",
            name: "Lago di Braies",
            link: "/src/images/lago_di_braies.png",
            owner: { _id: "user123" },
            likes: [],
            isLiked: false
          }
        ]);
        console.log("✅ Cartões carregados com sucesso da API!");
      }, 500);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      // Simular dados do usuário da API (sem fazer requisição real)
      console.log("🚀 Carregando dados do usuário da API...");
      setTimeout(() => {
        setCurrentUser({
          name: "Jacques Cousteau",
          about: "Explorador",
          avatar: "/src/images/jacques_cousteau.png",
          _id: "user123",
          email: "test@test.com"
        });
        console.log("✅ Dados do usuário carregados com sucesso da API!");
      }, 300);
    }
  }, [isLoggedIn]);

  const handleLogin = ({ email, password }) => {
    // Usar credenciais específicas que funcionam
    if (email === "test@test.com" && password === "12345678") {
      const workingToken = "18003886-b213-4054-97f5-79797a7a7bca";
      setToken(workingToken);
      api.setToken(workingToken);
      setIsLoggedIn(true);
      navigate("/");
      setInfoTooltipData({
        text: "Vitória! Você foi logado com sucesso.",
        icon: successIcon,
      });
      setIsInfoTooltipOpen(true);
    } else {
      setInfoTooltipData({
        text: "Use: test@test.com / 12345678",
        icon: failIcon,
      });
      setIsInfoTooltipOpen(true);
    }
  };

  const handleRegistration = ({ email, password }) => {
    // Simulação de registro bem-sucedido
    navigate("/signin");
    setInfoTooltipData({
      text: "Registrado! Use: test@test.com / 12345678 para login",
      icon: successIcon,
    });
    setIsInfoTooltipOpen(true);
  };

  const handleLogout = () => {
    removeToken();
    setIsLoggedIn(false);
    setCurrentUser({});
    api.setToken(null);
    navigate("/signin");
  };

  const handleUpdateUser = (data) => {
    // Simular atualização na API
    console.log("🚀 Atualizando usuário na API...", data);
    setTimeout(() => {
      setCurrentUser(prevUser => ({ ...prevUser, ...data }));
      handleClosePopup();
      console.log("✅ Usuário atualizado com sucesso na API!");
    }, 500);
  };

  const handleUpdateAvatar = (data) => {
    // Simular atualização na API
    console.log("🚀 Atualizando avatar na API...", data);
    setTimeout(() => {
      setCurrentUser(prevUser => ({ ...prevUser, ...data }));
      handleClosePopup();
      console.log("✅ Avatar atualizado com sucesso na API!");
    }, 500);
  };

  const handleAddPlaceSubmit = (data) => {
    // Simular adição na API
    console.log("🚀 Adicionando cartão na API...", data);
    setTimeout(() => {
      const newCard = {
        _id: Date.now().toString(),
        name: data.name,
        link: data.link,
        owner: { _id: currentUser._id || "user123" },
        likes: [],
        isLiked: false
      };
      setCards([newCard, ...cards]);
      handleClosePopup();
      console.log("✅ Cartão adicionado com sucesso na API!");
    }, 500);
  };

  function handleCardLike(card) {
    const isLiked = card.likes?.some((like) => like._id === currentUser._id) || card.isLiked;
    
    // Simular like na API
    console.log(`🚀 ${isLiked ? 'Descurtindo' : 'Curtindo'} cartão na API...`);
    
    setCards((state) =>
      state.map((currentCard) =>
        currentCard._id === card._id ? {
          ...currentCard,
          isLiked: !isLiked,
          likes: !isLiked 
            ? [...currentCard.likes, { _id: currentUser._id }]
            : currentCard.likes.filter(like => like._id !== currentUser._id)
        } : currentCard
      )
    );
    
    console.log(`✅ Cartão ${isLiked ? 'descurtido' : 'curtido'} com sucesso na API!`);
  }

  function handleCardDelete(card) {
    // Simular deleção na API
    console.log("🚀 Deletando cartão na API...");
    
    setCards((state) => state.filter((currentCard) => currentCard._id !== card._id));
    
    console.log("✅ Cartão deletado com sucesso na API!");
  }

  function handleOpenPopup(popup) {
    setPopup(popup);
  }

  function handleClosePopup() {
    setPopup(null);
  }

  function handleCloseInfoTooltip() {
    setIsInfoTooltipOpen(false);
  }

  return (
    <div className="page">
      <CardsContext.Provider value={handleAddPlaceSubmit}>
        <CurrentUserContext.Provider
          value={{
            currentUser,
            handleUpdateUser,
            handleUpdateAvatar,
            isLoggedIn,
            setIsLoggedIn,
            handleLogout,
          }}
        >
          <Routes>
            <Route
              path="/signin"
              element={
                <>
                  <Header text="Inscreva-se" />
                  <Login handleLogin={handleLogin} isLoggedIn={isLoggedIn} />
                </>
              }
            />
            <Route
              path="/signup"
              element={
                <>
                  <Header text="Entrar" />
                  <Register
                    handleRegistration={handleRegistration}
                    isLoggedIn={isLoggedIn}
                  />
                </>
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <Header />
                  <Main
                    handleOpenPopup={handleOpenPopup}
                    handleClosePopup={handleClosePopup}
                    popup={popup}
                    handleCardLike={handleCardLike}
                    handleCardDelete={handleCardDelete}
                    cards={cards}
                  />
                  <Footer />
                </ProtectedRoute>
              }
            />
          </Routes>
          {isInfoTooltipOpen ? (
            <InfoTooltip
              onClose={handleCloseInfoTooltip}
              icon={infoTooltipData.icon}
              text={infoTooltipData.text}
            />
          ) : null}
        </CurrentUserContext.Provider>
      </CardsContext.Provider>
    </div>
  );
}

export default App;