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

    // Set token in API headers immediately when found in localStorage
    api.setToken(jwt);
    setIsLoggedIn(true);
    navigate("/");
  }, [navigate]);

  useEffect(() => {
    if (isLoggedIn) {
      // Carregar cartões padrão direto (sem API por enquanto)
      setCards([
        {
          _id: "1",
          name: "Vale de Yosemite",
          link: "/src/images/vale_yosemite.png",
          owner: { _id: "default-user" },
          likes: [],
          isLiked: false
        },
        {
          _id: "2",
          name: "Lago Louise",
          link: "/src/images/lago_louise.png",
          owner: { _id: "default-user" },
          likes: [],
          isLiked: false
        },
        {
          _id: "3",
          name: "Montanhas Carpathian",
          link: "/src/images/montanhas_care.png",
          owner: { _id: "default-user" },
          likes: [],
          isLiked: false
        },
        {
          _id: "4",
          name: "Latemar",
          link: "/src/images/latemar.png",
          owner: { _id: "default-user" },
          likes: [],
          isLiked: false
        },
        {
          _id: "5",
          name: "Parque Nacional",
          link: "/src/images/parque_nacional.png",
          owner: { _id: "default-user" },
          likes: [],
          isLiked: false
        },
        {
          _id: "6",
          name: "Lago di Braies",
          link: "/src/images/lago_di_braies.png",
          owner: { _id: "default-user" },
          likes: [],
          isLiked: false
        }
      ]);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      // Definir usuário padrão (sem API por enquanto)
      setCurrentUser({
        name: "Jacques Cousteau",
        about: "Explorador",
        avatar: "/src/images/jacques_cousteau.png",
        _id: "default-user"
      });
    }
  }, [isLoggedIn]);

  const handleLogin = ({ email, password }) => {
    // Simplified login - just use the fixed token
    const fixedToken = "18003886-b213-4054-97f5-79797a7a7bca";
    
    // Save token to localStorage
    setToken(fixedToken);
    // Set token in API headers
    api.setToken(fixedToken);
    setIsLoggedIn(true);
    navigate("/");
    setInfoTooltipData({
      text: "Vitória! Você foi logado com sucesso.",
      icon: successIcon,
    });
    setIsInfoTooltipOpen(true);
  };

  const handleRegistration = ({ email, password }) => {
    auth
      .signup(email, password)
      .then(() => {
        navigate("/signin");
        setInfoTooltipData({
          text: "Vitória! Você precisa se registrar.",
          icon: successIcon,
        });
      })
      .catch((error) => {
        setInfoTooltipData({
          text: "Ops, algo deu errado! Por favor, tente novamente.",
          icon: failIcon,
        });
        console.error(error);
      })
      .finally(() => {
        setIsInfoTooltipOpen(true);
      });
  };

  const handleLogout = () => {
    removeToken();
    setIsLoggedIn(false);
    setCurrentUser({});
    api.setToken(null);
    navigate("/signin");
  };

  const handleUpdateUser = (data) => {
    // Atualizar dados localmente (sem API)
    setCurrentUser(prevUser => ({ ...prevUser, ...data }));
    handleClosePopup();
    console.log("Usuário atualizado localmente:", data);
  };

  const handleUpdateAvatar = (data) => {
    // Atualizar avatar localmente (sem API)
    setCurrentUser(prevUser => ({ ...prevUser, ...data }));
    handleClosePopup();
    console.log("Avatar atualizado localmente:", data);
  };

  const handleAddPlaceSubmit = (data) => {
    // Adicionar cartão localmente (sem API)
    const newCard = {
      _id: Date.now().toString(), // ID único baseado no timestamp
      name: data.name,
      link: data.link,
      owner: { _id: "default-user" },
      likes: [],
      isLiked: false
    };
    setCards([newCard, ...cards]);
    handleClosePopup();
    console.log("Cartão adicionado localmente:", newCard);
  };

  function handleCardLike(card) {
    // Curtir/descurtir localmente (sem API)
    const isLiked = card.isLiked;
    
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
    console.log("Like atualizado localmente para cartão:", card._id);
  }

  function handleCardDelete(card) {
    // Deletar cartão localmente (sem API)
    setCards((state) => state.filter((currentCard) => currentCard._id !== card._id));
    console.log("Cartão deletado localmente:", card._id);
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