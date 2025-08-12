// ===== src/contexts/AuthContext.js =====
import { createContext, useContext, useState, useEffect } from 'react';
import auth from '../utils/auth.js';
import api from '../utils/api.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Verificar se o usuário está logado ao carregar a aplicação
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = auth.getCurrentToken();
        console.log('🔍 Verificando token:', token ? 'Presente' : 'Ausente');
        
        if (token) {
          // Atualizar o token na API
          api.setToken(token);
          
          // Verificar se o token é válido
          const userData = await auth.checkToken();
          console.log('📊 Dados do usuário recebidos:', userData);
          setCurrentUser(userData.data);
          setIsAuthenticated(true);
          setAuthError(null);
          console.log('✅ Usuário autenticado:', userData.data);
        } else {
          setIsAuthenticated(false);
          setCurrentUser(null);
          console.log('❌ Nenhum token encontrado');
        }
      } catch (error) {
        console.error('❌ Erro ao verificar status de autenticação:', error);
        // Token inválido, limpar dados
        auth.logout();
        api.setToken(null);
        setIsAuthenticated(false);
        setCurrentUser(null);
        setAuthError('Sessão expirada. Faça login novamente.');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []); // Dependências vazias para executar apenas uma vez

  // Função para fazer login
  const login = async (credentials) => {
    setIsLoading(true);
    setAuthError(null);
    
    try {
      const response = await auth.login(credentials);
      
      if (response.token) {
        // Atualizar o token na API
        api.setToken(response.token);
        
        // Buscar informações do usuário
        const userData = await auth.checkToken();
        console.log('📊 Dados do usuário após login:', userData);
        setCurrentUser(userData.data);
        setIsAuthenticated(true);
        setAuthError(null);
        console.log('✅ Login realizado com sucesso');
        return { success: true };
      } else {
        throw new Error('Token não recebido na resposta');
      }
    } catch (error) {
      console.error('❌ Erro no login:', error);
      setAuthError(error.toString());
      setIsAuthenticated(false);
      setCurrentUser(null);
      return { success: false, error: error.toString() };
    } finally {
      setIsLoading(false);
    }
  };

  // Função para fazer registro
  const register = async (credentials) => {
    setIsLoading(true);
    setAuthError(null);
    
    try {
      const response = await auth.register(credentials);
      console.log('✅ Registro realizado com sucesso');
      setAuthError(null);
      return { success: true, data: response };
    } catch (error) {
      console.error('❌ Erro no registro:', error);
      setAuthError(error.toString());
      return { success: false, error: error.toString() };
    } finally {
      setIsLoading(false);
    }
  };

  // Função para fazer logout
  const logout = () => {
    auth.logout();
    api.setToken(null);
    setIsAuthenticated(false);
    setCurrentUser(null);
    setAuthError(null);
    console.log('👋 Logout realizado');
  };

  // Função para limpar erros de autenticação
  const clearAuthError = () => {
    setAuthError(null);
  };

  const value = {
    isAuthenticated,
    currentUser,
    isLoading,
    authError,
    login,
    register,
    logout,
    clearAuthError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 