// ===== src/components/Header/Header.jsx - COM AUTENTICAÇÃO =====
import { useAuth } from '../../contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const location = useLocation();

  // Determinar o conteúdo do header baseado na rota atual
  const getHeaderContent = () => {
    if (location.pathname === '/signin') {
      return (
        <Link to="/signup" className="header__link">
          Inscrever-se
        </Link>
      );
    }
    
    if (location.pathname === '/signup') {
      return (
        <Link to="/signin" className="header__link">
          Entrar
        </Link>
      );
    }
    
    // Se estiver logado e na rota principal
    if (isAuthenticated) {
      return (
        <div className="header__user-info">
          <span className="header__email">
            {currentUser?.email || 'usuário@email.com'}
          </span>
          <button 
            className="header__logout"
            onClick={logout}
            type="button"
          >
            Sair
          </button>
        </div>
      );
    }
    
    return null;
  };

  return (
    <header className="header page__container">
      <nav className="nav">
        <div className="nav__logo">
          <span className="nav__logo-main">Around</span>
          <span className="nav__logo-sub">The U.S.</span>
        </div>
        
        {getHeaderContent()}
      </nav>
    </header>
  );
}