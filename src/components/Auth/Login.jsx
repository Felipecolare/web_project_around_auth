/* eslint-disable no-undef */
// ===== src/components/Auth/Login.jsx =====
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  
  const { login, isLoading, authError, clearAuthError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirecionar se já estiver logado
  useEffect(() => {
    if (authError) {
      clearAuthError();
    }
  }, [authError, clearAuthError]);

  // Validação básica de email
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Verificar se o formulário é válido
  const checkFormValidity = (emailValue, passwordValue) => {
    const emailValid = emailValue.trim().length > 0 && isValidEmail(emailValue.trim());
    const passwordValid = passwordValue.trim().length >= 6;
    const formValid = emailValid && passwordValid;
    
    setIsFormValid(formValid);
    
    console.log('🔍 Validação do formulário de login:', {
      email: emailValid ? '✅' : '❌',
      password: passwordValid ? '✅' : '❌',
      isValid: formValid
    });
  };

  const handleEmailChange = (event) => {
    const newValue = event.target.value;
    setEmail(newValue);
    checkFormValidity(newValue, password);
    console.log('📧 Email alterado:', newValue);
  };

  const handlePasswordChange = (event) => {
    const newValue = event.target.value;
    setPassword(newValue);
    checkFormValidity(email, newValue);
    console.log('🔒 Senha alterada');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    // Validação básica
    if (!trimmedEmail) {
      alert('Por favor, preencha o email.');
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      alert('Por favor, insira um email válido.');
      return;
    }

    if (!trimmedPassword) {
      alert('Por favor, preencha a senha.');
      return;
    }

    if (trimmedPassword.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    const loginData = {
      email: trimmedEmail,
      password: trimmedPassword,
    };

    console.log('📤 Enviando dados de login:', { email: trimmedEmail, password: '[HIDDEN]' });

    // Tentar fazer login
    const result = await login(loginData);
    
    if (result.success) {
      // Redirecionar para a página de origem ou para a página principal
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  };

  console.log('🔄 Login render:', {
    email: email || 'Vazio',
    isFormValid,
    isLoading
  });

  return (
    <div className="auth">
      <div className="auth__container">
        <h2 className="auth__title">Entrar</h2>
        
        <form 
          className="auth__form" 
          onSubmit={handleSubmit}
        >
          <div className="auth__field">
            <input
              className="auth__input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
              disabled={isLoading}
              required
            />
            {email.trim().length > 0 && !isValidEmail(email.trim()) && (
              <span className="auth__error">Email inválido</span>
            )}
          </div>

          <div className="auth__field">
            <input
              className="auth__input"
              type="password"
              placeholder="Senha"
              value={password}
              onChange={handlePasswordChange}
              disabled={isLoading}
              required
              minLength="6"
            />
            {password.trim().length > 0 && password.trim().length < 6 && (
              <span className="auth__error">Senha deve ter pelo menos 6 caracteres</span>
            )}
          </div>

          <button 
            className={`auth__button ${isLoading || !isFormValid ? 'auth__button_disabled' : ''}`}
            type="submit"
            disabled={isLoading || !isFormValid}
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="auth__signin">
          <p className="auth__signin-text">
            Ainda não é membro? 
            <Link to="/signup" className="auth__signin-link"> Inscreva-se aqui!</Link>
          </p>
        </div>

        {/* Debug info - remover em produção */}
        {process.env.NODE_ENV === 'development' && (
          <div style={{fontSize: '12px', color: '#666', marginTop: '10px'}}>
            Debug: {isFormValid ? '✅ Formulário válido' : '❌ Formulário inválido'} 
            {isLoading && ' | 🔄 Entrando...'}
          </div>
        )}
      </div>
    </div>
  );
}