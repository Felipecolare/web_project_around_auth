// ===== src/utils/api.js =====
class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  // Método para atualizar o token de autorização
  setToken(token) {
    if (token) {
      this._headers.authorization = `Bearer ${token}`;
      console.log('🔑 Token de autorização atualizado na API');
    } else {
      delete this._headers.authorization;
      console.log('🔑 Token de autorização removido da API');
    }
  }

  // Método para obter o token atual
  getToken() {
    return this._headers.authorization ? this._headers.authorization.split(' ')[1] : null;
  }

  // Método para verificar se há um token válido
  hasValidToken() {
    const token = this.getToken();
    return !!token;
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    
    // Log detalhado do erro
    console.error(`❌ Erro HTTP ${res.status}: ${res.statusText}`);
    console.error('URL:', res.url);
    console.error('Headers da resposta:', Object.fromEntries(res.headers.entries()));
    
    // Verificar se é erro de autenticação
    if (res.status === 401) {
      console.error('🔑 Token provavelmente expirado ou inválido');
      return Promise.reject(`Erro de autenticação (${res.status}): Token expirado ou inválido. Faça login novamente.`);
    }
    
    if (res.status === 403) {
      console.error('🚫 Acesso negado');
      return Promise.reject(`Erro de autorização (${res.status}): Acesso negado.`);
    }
    
    // Tentar extrair mensagem de erro do corpo da resposta
    return res.text().then(text => {
      let errorMessage = `Erro: ${res.status} - ${res.statusText}`;
      
      try {
        const errorData = JSON.parse(text);
        if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch {
        // Se não conseguir fazer parse do JSON, usar o texto como está
        if (text) {
          errorMessage = text;
        }
      }
      
      return Promise.reject(errorMessage);
    });
  }

  _request(url, options) {
    console.log('🔄 Fazendo requisição para:', url);
    console.log('📋 Opções:', {
      method: options.method || 'GET',
      headers: options.headers,
      body: options.body ? 'Dados presentes' : 'Sem dados'
    });
    
    return fetch(url, options)
      .then(this._checkResponse)
      .catch(error => {
        console.error('❌ Erro na requisição:', error);
        throw error;
      });
  }

  // Método para verificar se o token está válido
  _checkTokenValidity() {
    // Decodificar o token JWT para verificar expiração
    try {
      const token = this.getToken();
      if (!token) {
        console.warn('⚠️ Nenhum token encontrado!');
        return false;
      }
      
      const payload = JSON.parse(atob(token.split('.')[1])); // Decodifica o payload
      const currentTime = Math.floor(Date.now() / 1000); // Tempo atual em segundos
      
      if (payload.exp && payload.exp < currentTime) {
        console.warn('⚠️ Token JWT expirado!');
        console.warn('Expiração:', new Date(payload.exp * 1000));
        console.warn('Tempo atual:', new Date());
        return false;
      }
      
      console.log('✅ Token JWT válido até:', new Date(payload.exp * 1000));
      return true;
    } catch (error) {
      console.error('❌ Erro ao verificar token:', error);
      return false; // Se não conseguir decodificar, assume que o token é inválido
    }
  }

  // Método para obter informações do usuário
  getUserInfo() {
    console.log('🔍 Buscando informações do usuário...');
    
    if (!this.hasValidToken()) {
      return Promise.reject('Nenhum token de autorização encontrado. Faça login novamente.');
    }
    
    if (!this._checkTokenValidity()) {
      return Promise.reject('Token expirado. Faça login novamente.');
    }
    
    return this._request(`${this._baseUrl}/users/me`, {
      headers: this._headers,
    });
  }

  // Método para atualizar informações do usuário
  setUserInfo({ name, about }) {
    console.log('📝 Atualizando informações do usuário:', { name, about });
    
    if (!this._checkTokenValidity()) {
      return Promise.reject('Token expirado. Faça login novamente.');
    }
    
    return this._request(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        name,
        about,
      }),
    });
  }

  // Método para obter todos os cartões
  getInitialCards() {
    console.log('🃏 Buscando cartões...');
    
    if (!this._checkTokenValidity()) {
      return Promise.reject('Token expirado. Faça login novamente.');
    }
    
    return this._request(`${this._baseUrl}/cards`, {
      headers: this._headers,
    });
  }

  // Método para adicionar um novo cartão
  addCard({ name, link }) {
    console.log('➕ Adicionando novo cartão:', { name, link });
    
    if (!this._checkTokenValidity()) {
      return Promise.reject('Token expirado. Faça login novamente.');
    }
    
    return this._request(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({
        name,
        link,
      }),
    });
  }

  // Método para deletar um cartão
  deleteCard(cardId) {
    console.log('🗑️ Deletando cartão:', cardId);
    
    if (!this._checkTokenValidity()) {
      return Promise.reject('Token expirado. Faça login novamente.');
    }
    
    return this._request(`${this._baseUrl}/cards/${cardId}`, {
      method: "DELETE",
      headers: this._headers,
    });
  }

  // Método para curtir um cartão
  likeCard(cardId) {
    console.log('❤️ Curtindo cartão:', cardId);
    
    if (!this._checkTokenValidity()) {
      return Promise.reject('Token expirado. Faça login novamente.');
    }
    
    return this._request(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: "PUT",
      headers: this._headers,
    });
  }

  // Método para descurtir um cartão
  dislikeCard(cardId) {
    console.log('💔 Descurtindo cartão:', cardId);
    
    if (!this._checkTokenValidity()) {
      return Promise.reject('Token expirado. Faça login novamente.');
    }
    
    return this._request(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: "DELETE",
      headers: this._headers,
    });
  }

  // Método para alterar curtida (like/dislike)
  changeLikeCardStatus(cardId, isLiked) {
    console.log('💝 Alterando status do like:', cardId, isLiked ? 'descurtir' : 'curtir');
    
    if (!this._checkTokenValidity()) {
      return Promise.reject('Token expirado. Faça login novamente.');
    }
    
    return this._request(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: isLiked ? "DELETE" : "PUT",
      headers: this._headers,
    });
  }

  // Método para atualizar avatar do usuário
  setUserAvatar({ avatar }) {
    console.log('🖼️ Atualizando avatar do usuário:', avatar);
    
    if (!this._checkTokenValidity()) {
      return Promise.reject('Token expirado. Faça login novamente.');
    }
    
    return this._request(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        avatar,
      }),
    });
  }
}

// Criando uma instância da API com os parâmetros necessários
const api = new Api({
  baseUrl: "https://se-register-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzQyMWZjODcxZWNiMzAwMWVmOTQ1MjciLCJpYXQiOjE3MzI0MDI0NTZ9.QPlus1HCvJGqhYGlqQJdRCM-LqJn6I1OJ2fKN1t-DqE",
    "Content-Type": "application/json",
  },
});

// Teste imediato da API com informações detalhadas
console.log('🧪 Testando conexão da API...');
console.log('🔗 URL base:', api._baseUrl);
console.log('🎯 Headers:', api._headers);

// Verificar se o token está válido antes de testar
if (api.hasValidToken()) {
  api.getUserInfo()
    .then(userData => {
      console.log('✅ API funcionando! Dados do usuário:', userData);
    })
    .catch(err => {
      console.error('❌ Erro na API:', err);
      console.log('💡 Dica: Verifique se o token não expirou e se a URL da API está correta.');
    });
} else {
  console.error('❌ Nenhum token de autorização encontrado. Não é possível testar a API.');
}

export default api;