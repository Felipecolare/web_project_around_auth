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
      return;
    }

    // Set token in API headers immediately when found in localStorage
    api.setToken(jwt);

    auth.getUserAuth(jwt).then((response) => {
      if (response && response.data) {
        const email = { email: response.data.email };
        setCurrentUser((prevData) => ({ ...prevData, ...email }));
        setIsLoggedIn(true);
        navigate("/");
      }
    }).catch((error) => {
      console.error("Erro ao verificar token:", error);
      removeToken();
      api.setToken(null); // Clear token from API headers
    });
  }, [navigate]);

  useEffect(() => {
    if (isLoggedIn) {
      api
        .getInitialCards()
        .then((data) => {
          setCards(data);
        })
        .catch((err) => {
          console.error("Erro ao carregar cartões:", err);
          // Se não conseguir carregar da API, usar cartões padrão
          setCards([
            {
              _id: "1",
              name: "Vale de Yosemite",
              link: "/src/images/vale_yosemite.png",
              owner: { _id: currentUser._id || "default-user" },
              likes: [],
              isLiked: false
            },
            {
              _id: "2",
              name: "Lago Louise",
              link: "/src/images/lago_louise.png",
              owner: { _id: currentUser._id || "default-user" },
              likes: [],
              isLiked: false
            },
            {
              _id: "3",
              name: "Montanhas Carpathian",
              link: "/src/images/montanhas_care.png",
              owner: { _id: currentUser._id || "default-user" },
              likes: [],
              isLiked: false
            },
            {
              _id: "4",
              name: "Latemar",
              link: "/src/images/latemar.png",
              owner: { _id: currentUser._id || "default-user" },
              likes: [],
              isLiked: false
            },
            {
              _id: "5",
              name: "Parque Nacional",
              link: "/src/images/parque_nacional.png",
              owner: { _id: currentUser._id || "default-user" },
              likes: [],
              isLiked: false
            },
            {
              _id: "6",
              name: "Lago di Braies",
              link: "/src/images/lago_di_braies.png",
              owner: { _id: currentUser._id || "default-user" },
              likes: [],
              isLiked: false
            }
          ]);
        });
    }
  }, [isLoggedIn, currentUser._id]);

  useEffect(() => {
    if (isLoggedIn) {
      api
        .getUserInfo()
        .then((data) => {
          setCurrentUser(data);
        })
        .catch((err) => {
          console.error("Erro ao carregar dados do usuário:", err);
        });
    }
  }, [isLoggedIn]);

  const handleLogin = ({ email, password }) => {
    auth
      .signin(email, password)
      .then((response) => {
        if (response.token) {
          // First save token to localStorage
          setToken(response.token);
          // Then set token in API headers
          api.setToken(response.token);
          setIsLoggedIn(true);
          navigate("/");
          setInfoTooltipData({
            text: "Vitória! Você foi logado com sucesso.",
            icon: successIcon,
          });
        }
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
    api.setUserInfo(data).then((newData) => {
      setCurrentUser(newData);
      handleClosePopup();
    }).catch((error) => {
      console.error("Erro ao atualizar usuário:", error);
    });
  };

  const handleUpdateAvatar = (data) => {
    api.setAvatar(data).then((newData) => {
      setCurrentUser(newData);
      handleClosePopup();
    }).catch((error) => {
      console.error("Erro ao atualizar avatar:", error);
    });
  };

  const handleAddPlaceSubmit = (data) => {
    api.newCard(data).then((newCard) => {
      setCards([newCard, ...cards]);
      handleClosePopup();
    }).catch((error) => {
      console.error("Erro ao adicionar cartão:", error);
    });
  };

  async function handleCardLike(card) {
    const isLiked = card.likes?.some((like) => like._id === currentUser._id) || card.isLiked;
    try {
      let newCard;
      if (isLiked) {
        newCard = await api.unlikedCard(card._id);
      } else {
        newCard = await api.likedCard(card._id);
      }
      
      setCards((state) =>
        state.map((currentCard) =>
          currentCard._id === card._id ? {
            ...newCard,
            isLiked: newCard.likes?.some((like) => like._id === currentUser._id)
          } : currentCard
        )
      );
    } catch (error) {
      console.error("Erro ao curtir/descurtir cartão:", error);
    }
  }

  async function handleCardDelete(card) {
    try {
      await api.deleteCard(card._id);
      setCards((state) =>
        state.filter((currentCard) => currentCard._id !== card._id)
      );
    } catch (error) {
      console.error("Erro ao deletar cartão:", error);
    }
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