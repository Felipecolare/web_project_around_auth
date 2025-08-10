/* eslint-disable no-undef */
// ===== src/components/Auth/Register.jsx =====
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  
  const { register, isLoading, authError, clearAuthError } = useAuth();
  const navigate = useNavigate();

  // Limpar erros ao montar o componente
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
  const checkFormValidity = (emailValue, passwordValue, confirmPasswordValue) => {
    const emailValid = emailValue.trim().length > 0 && isValidEmail(emailValue.trim());
    const passwordValid = passwordValue.trim().length >= 6;
    const confirmPasswordValid = confirmPasswordValue.trim().length >= 6 && 
                                confirmPasswordValue === passwordValue;
    const formValid = emailValid && passwordValid && confirmPasswordValid;
    
    setIsFormValid(formValid);
    
    console.log('🔍 Validação do formulário de registro:', {
      email: emailValid ? '✅' : '❌',
      password: passwordValid ? '✅' : '❌',
      confirmPassword: confirmPasswordValid ? '✅' : '❌',
      isValid: formValid
    });
  };

  const handleEmailChange = (event) => {
    const newValue = event.target.value;
    setEmail(newValue);
    checkFormValidity(newValue, password, confirmPassword);
    console.log('📧 Email alterado:', newValue);
  };

  const handlePasswordChange = (event) => {
    const newValue = event.target.value;
    setPassword(newValue);
    checkFormValidity(email, newValue, confirmPassword);
    console.log('🔒 Senha alterada');
  };

  const handleConfirmPasswordChange = (event) => {
    const newValue = event.target.value;
    setConfirmPassword(newValue);
    checkFormValidity(email, password, newValue);
    console.log('🔒 Confirmação de senha alterada');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

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

    if (!trimmedConfirmPassword) {
      alert('Por favor, confirme a senha.');
      return;
    }

    if (trimmedPassword !== trimmedConfirmPassword) {
      alert('As senhas não coincidem.');
      return;
    }

    const registerData = {
      email: trimmedEmail,
      password: trimmedPassword,
    };

    console.log('📤 Enviando dados de registro:', { email: trimmedEmail, password: '[HIDDEN]' });

    // Tentar fazer registro
    const result = await register(registerData);
    
    if (result.success) {
      // Redirecionar para login após registro bem-sucedido
      alert('Registro realizado com sucesso! Agora faça login.');
      navigate('/signin');
    }
  };

  console.log('🔄 Register render:', {
    email: email || 'Vazio',
    isFormValid,
    isLoading
  });

  return (
    <div className="auth">
      <div className="auth__container">
        <h2 className="auth__title">Inscrever-se</h2>
        
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

          <div className="auth__field">
            <input
              className="auth__input"
              type="password"
              placeholder="Confirmar senha"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              disabled={isLoading}
              required
              minLength="6"
            />
            {confirmPassword.trim().length > 0 && password !== confirmPassword && (
              <span className="auth__error">As senhas não coincidem</span>
            )}
          </div>

          <button 
            className={`auth__button ${isLoading || !isFormValid ? 'auth__button_disabled' : ''}`}
            type="submit"
            disabled={isLoading || !isFormValid}
          >
            {isLoading ? 'Inscrevendo...' : 'Inscrever-se'}
          </button>
        </form>

        <div className="auth__signin">
          <p className="auth__signin-text">
            Já é um membro? 
            <Link to="/signin" className="auth__signin-link"> Faça o login aqui!</Link>
          </p>
        </div>

        {/* Debug info - remover em produção */}
        {process.env.NODE_ENV === 'development' && (
          <div style={{fontSize: '12px', color: '#666', marginTop: '10px'}}>
            Debug: {isFormValid ? '✅ Formulário válido' : '❌ Formulário inválido'} 
            {isLoading && ' | 🔄 Inscrevendo...'}
          </div>
        )}
      </div>
    </div>
  );
}