// ===== src/components/ProtectedRoute/ProtectedRoute.jsx =====
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  console.log('🔒 ProtectedRoute - Status:', { isAuthenticated, isLoading, location: location.pathname });

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    console.log('⏳ Mostrando loading...');
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px'
      }}>
        🔄 Verificando autenticação...
      </div>
    );
  }

  // Se não estiver autenticado, redirecionar para login
  if (!isAuthenticated) {
    console.log('🚫 Acesso negado, redirecionando para login');
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // Se estiver autenticado, renderizar o conteúdo protegido
  console.log('✅ Acesso permitido ao conteúdo protegido');
  return children;
}