// ===== src/utils/api.js =====
// Classe principal da API para gerenciar todas as operações com o servidor
class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  // ===== MÉTODOS DE AUTENTICAÇÃO E TOKEN =====
  
  /**
   * Atualiza o token de autorização nos headers
   * @param {string} token - Token JWT para autenticação
   */
  setToken(token) {
    if (token) {
      this._headers.authorization = `Bearer ${token}`;
      console.log('🔑 Token de autorização atualizado na API');
    } else {
      delete this._headers.authorization;
      console.log('🔑 Token de autorização removido da API');
    }
  }

  /**
   * Obtém o token atual dos headers
   * @returns {string|null} Token JWT ou null se não existir
   */
  getToken() {
    return this._headers.authorization ? this._headers.authorization.split(' ')[1] : null;
  }

  /**
   * Verifica se há um token válido
   * @returns {boolean} true se o token existir
   */
  hasValidToken() {
    const token = this.getToken();
    return !!token;
  }

  /**
   * Verifica se o token JWT está válido e não expirou
   * @returns {boolean} true se o token for válido
   */
  _checkTokenValidity() {
    try {
      const token = this.getToken();
      if (!token) {
        console.warn('⚠️ Nenhum token encontrado!');
        return false;
      }
      
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
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
      return false;
    }
  }

  // ===== MÉTODOS INTERNOS DE REQUISIÇÃO =====
  
  /**
   * Verifica e processa a resposta da API
   * @param {Response} res - Objeto de resposta do fetch
   * @returns {Promise} Promise com dados ou erro
   */
  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    
    // Log detalhado do erro
    console.error(`❌ Erro HTTP ${res.status}: ${res.statusText}`);
    console.error('URL:', res.url);
    console.error('Headers da resposta:', Object.fromEntries(res.headers.entries()));
    
    // Verificar erros específicos
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
      } catch (e) { // eslint-disable-line no-unused-vars
        if (text) {
          errorMessage = text;
        }
      }
      
      return Promise.reject(errorMessage);
    });
  }

  /**
   * Executa uma requisição HTTP para a API
   * @param {string} url - URL da requisição
   * @param {Object} options - Opções da requisição (method, headers, body)
   * @returns {Promise} Promise com a resposta processada
   */
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

  // ===== MÉTODOS DE USUÁRIO =====
  
  /**
   * Obtém informações do usuário logado
   * @returns {Promise} Promise com dados do usuário
   */
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

  /**
   * Atualiza informações do usuário
   * @param {Object} userData - Dados do usuário
   * @param {string} userData.name - Nome do usuário
   * @param {string} userData.about - Descrição do usuário
   * @returns {Promise} Promise com dados atualizados
   */
  setUserInfo({ name, about }) {
    console.log('📝 Atualizando informações do usuário:', { name, about });
    
    if (!this._checkTokenValidity()) {
      return Promise.reject('Token expirado. Faça login novamente.');
    }
    
    return this._request(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({ name, about }),
    });
  }

  /**
   * Atualiza o avatar do usuário
   * @param {Object} avatarData - Dados do avatar
   * @param {string} avatarData.avatar - URL do novo avatar
   * @returns {Promise} Promise com dados atualizados
   */
  setUserAvatar({ avatar }) {
    console.log('🖼️ Atualizando avatar do usuário:', avatar);
    
    if (!this._checkTokenValidity()) {
      return Promise.reject('Token expirado. Faça login novamente.');
    }
    
    return this._request(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({ avatar }),
    });
  }

  // ===== MÉTODOS DE CARTÕES =====
  
  /**
   * Obtém todos os cartões da API
   * @returns {Promise} Promise com array de cartões
   */
  getInitialCards() {
    console.log('🃏 Buscando cartões...');
    
    if (!this._checkTokenValidity()) {
      return Promise.reject('Token expirado. Faça login novamente.');
    }
    
    return this._request(`${this._baseUrl}/cards`, {
      headers: this._headers,
    });
  }

  /**
   * Adiciona um novo cartão
   * @param {Object} cardData - Dados do cartão
   * @param {string} cardData.name - Nome do cartão
   * @param {string} cardData.link - URL da imagem do cartão
   * @returns {Promise} Promise com o cartão criado
   */
  addCard({ name, link }) {
    console.log('➕ Adicionando novo cartão:', { name, link });
    
    if (!this._checkTokenValidity()) {
      return Promise.reject('Token expirado. Faça login novamente.');
    }
    
    return this._request(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({ name, link }),
    });
  }

  /**
   * Remove um cartão pelo ID
   * @param {string} cardId - ID do cartão a ser removido
   * @returns {Promise} Promise com confirmação da remoção
   */
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

  // ===== MÉTODOS DE CURTIDAS =====
  
  /**
   * Adiciona uma curtida ao cartão
   * @param {string} cardId - ID do cartão
   * @returns {Promise} Promise com dados atualizados do cartão
   */
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

  /**
   * Remove uma curtida do cartão
   * @param {string} cardId - ID do cartão
   * @returns {Promise} Promise com dados atualizados do cartão
   */
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

  /**
   * Altera o status de curtida de um cartão
   * @param {string} cardId - ID do cartão
   * @param {boolean} isLiked - true se já está curtido, false se não
   * @returns {Promise} Promise com dados atualizados do cartão
   */
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
}

// ===== INSTÂNCIA DA API =====
// Criando uma instância da API com os parâmetros necessários
const api = new Api({
  baseUrl: "https://se-register-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzQyMWZjODcxZWNiMzAwMWVmOTQ1MjciLCJpYXQiOjE3MzI0MDI0NTZ9.QPlus1HCvJGqhYGlqQJdRCM-LqJn6I1OJ2fKN1t-DqE",
    "Content-Type": "application/json",
  },
});

// ===== TESTE INICIAL DA API =====
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