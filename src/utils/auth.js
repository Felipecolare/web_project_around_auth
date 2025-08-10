// ===== src/utils/auth.js =====
class Auth {
  constructor({ baseUrl }) {
    this._baseUrl = baseUrl;
  }

  // Método para salvar token no localStorage
  _saveToken(token) {
    localStorage.setItem('jwt', token);
    console.log('💾 Token salvo no localStorage');
  }

  // Método para obter token do localStorage
  _getToken() {
    const token = localStorage.getItem('jwt');
    console.log('🔍 Token obtido do localStorage:', token ? 'Presente' : 'Ausente');
    return token;
  }

  // Método para remover token do localStorage
  _removeToken() {
    localStorage.removeItem('jwt');
    console.log('🗑️ Token removido do localStorage');
  }

  // Método para verificar se o usuário está logado
  isLoggedIn() {
    const token = this._getToken();
    return !!token;
  }

  // Método para fazer logout
  logout() {
    this._removeToken();
    console.log('👋 Usuário deslogado');
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    
    // Log detalhado do erro
    console.error(`❌ Erro HTTP ${res.status}: ${res.statusText}`);
    console.error('URL:', res.url);
    
    if (res.status === 400) {
      console.error('🚫 Dados inválidos fornecidos');
      return Promise.reject(`Erro 400: Dados inválidos. Verifique as informações fornecidas.`);
    }
    
    if (res.status === 401) {
      console.error('🔑 Credenciais inválidas');
      return Promise.reject(`Erro 401: Email ou senha incorretos.`);
    }
    
    if (res.status === 409) {
      console.error('👥 Usuário já existe');
      return Promise.reject(`Erro 409: Este email já está cadastrado.`);
    }
    
    // Tentar extrair mensagem de erro do corpo da resposta
    return res.text().then(text => {
      let errorMessage = `Erro: ${res.status} - ${res.statusText}`;
      
      try {
        const errorData = JSON.parse(text);
        if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch  {
        if (text) {
          errorMessage = text;
        }
      }
      
      return Promise.reject(errorMessage);
    });
  }

  _request(url, options) {
    console.log('🔄 Fazendo requisição de auth para:', url);
    console.log('📋 Opções:', {
      method: options.method || 'GET',
      headers: options.headers,
      body: options.body ? 'Dados presentes' : 'Sem dados'
    });
    
    return fetch(url, options)
      .then(this._checkResponse)
      .catch(error => {
        console.error('❌ Erro na requisição de auth:', error);
        throw error;
      });
  }

  // Método para registrar usuário
  register({ email, password }) {
    console.log('📝 Registrando usuário:', email);
    
    return this._request(`${this._baseUrl}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
  }

  // Método para fazer login
  login({ email, password }) {
    console.log('🔐 Fazendo login:', email);
    
    return this._request(`${this._baseUrl}/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }).then(data => {
      // Salvar token após login bem-sucedido
      if (data.token) {
        this._saveToken(data.token);
        console.log('✅ Login realizado com sucesso, token salvo');
      }
      return data;
    });
  }

  // Método para verificar token
  checkToken(token) {
    console.log('🔍 Verificando token...');
    
    const tokenToUse = token || this._getToken();
    if (!tokenToUse) {
      return Promise.reject('Nenhum token fornecido');
    }
    
    return this._request(`${this._baseUrl}/users/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenToUse}`,
      },
    });
  }

  // Método para obter token atual
  getCurrentToken() {
    return this._getToken();
  }
}

// Criando instância da Auth com a URL correta
const auth = new Auth({
  baseUrl: 'https://se-register-api.en.tripleten-services.com/v1',
});

console.log('🔐 Auth API inicializada');
console.log('🔗 URL base:', auth._baseUrl);

export default auth;