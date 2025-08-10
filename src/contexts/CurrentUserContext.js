// ===== src/contexts/CurrentUserContext.js =====
import { createContext, useContext } from 'react';

// Criar e exportar o contexto do usuário atual
const CurrentUserContext = createContext();

// Hook personalizado para usar o contexto
export const useCurrentUser = () => {
  const context = useContext(CurrentUserContext);
  if (!context) {
    throw new Error('useCurrentUser deve ser usado dentro de um CurrentUserProvider');
  }
  return context;
};

export default CurrentUserContext;