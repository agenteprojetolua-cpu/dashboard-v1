// ==========================================
// SISTEMA DE AUTENTICAÇÃO
// ==========================================

// Usuários autorizados (em produção, isso deveria vir de um backend)
const USERS = [
  {
    email: 'projetolua@email.com',
    password: 'projetolua',
    name: 'Projeto Lua'
  },
  {
    email: 'admin@email.com',
    password: 'admin',
    name: 'Administrador'
  }
];

// ==========================================
// FUNÇÕES DE AUTENTICAÇÃO
// ==========================================

/**
 * Verifica se o usuário está autenticado
 * @returns {boolean} True se o usuário estiver autenticado
 */
function isAuthenticated() {
  const session = sessionStorage.getItem('luaAuth');
  return session !== null;
}

/**
 * Obtém os dados do usuário logado
 * @returns {Object|null} Dados do usuário ou null
 */
function getCurrentUser() {
  const session = sessionStorage.getItem('luaAuth');
  if (session) {
    try {
      return JSON.parse(session);
    } catch (e) {
      return null;
    }
  }
  return null;
}

/**
 * Realiza o login do usuário
 * @param {string} email - Email do usuário
 * @param {string} password - Senha do usuário
 * @returns {Object} Resultado do login com sucesso e mensagem
 */
function login(email, password) {
  // Busca o usuário
  const user = USERS.find(u => u.email === email && u.password === password);
  
  if (user) {
    // Cria sessão (remove a senha por segurança)
    const userSession = {
      email: user.email,
      name: user.name,
      loginTime: new Date().toISOString()
    };
    
    sessionStorage.setItem('luaAuth', JSON.stringify(userSession));
    
    return {
      success: true,
      message: 'Login realizado com sucesso!',
      user: userSession
    };
  }
  
  return {
    success: false,
    message: 'Email ou senha incorretos. Tente novamente.'
  };
}

/**
 * Realiza o logout do usuário
 */
function logout() {
  sessionStorage.removeItem('luaAuth');
  window.location.href = 'login.html';
}

/**
 * Protege uma página verificando se o usuário está autenticado
 * Redireciona para login se não estiver
 */
function requireAuth() {
  if (!isAuthenticated()) {
    window.location.href = 'login.html';
  }
}

// ==========================================
// INTERFACE DE LOGIN (para login.html)
// ==========================================

// Se estamos na página de login
if (window.location.pathname.includes('login.html')) {
  // Verifica se já está logado
  if (isAuthenticated()) {
    window.location.href = 'index.html';
  }

  // Aguarda o DOM carregar
  document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    const loginButton = document.getElementById('loginButton');
    const loginButtonText = document.getElementById('loginButtonText');
    const loginButtonLoader = document.getElementById('loginButtonLoader');

    // Previne o comportamento padrão do formulário
    loginForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // Desabilita o botão
      loginButton.disabled = true;
      loginButtonText.style.display = 'none';
      loginButtonLoader.style.display = 'block';
      errorMessage.classList.remove('show');
      
      // Obtém os valores
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      
      // Simula um pequeno delay para dar feedback visual
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Tenta fazer login
      const result = login(email, password);
      
      if (result.success) {
        // Animação de sucesso
        loginButton.classList.add('success');
        loginButtonText.textContent = 'Entrando...';
        loginButtonText.style.display = 'inline';
        loginButtonLoader.style.display = 'none';
        
        // Redireciona após um breve delay
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 500);
      } else {
        // Mostra mensagem de erro
        errorMessage.textContent = result.message;
        errorMessage.classList.add('show');
        
        // Reabilita o botão
        loginButton.disabled = false;
        loginButtonText.style.display = 'inline';
        loginButtonLoader.style.display = 'none';
        
        // Limpa a senha
        document.getElementById('password').value = '';
        document.getElementById('password').focus();
      }
    });

    // Foco automático no campo de email
    document.getElementById('email').focus();
  });
}

// ==========================================
// INTERFACE DO DASHBOARD (para index.html)
// ==========================================

// Se estamos na página do dashboard
if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
  // Protege a página
  requireAuth();

  // Aguarda o DOM carregar
  document.addEventListener('DOMContentLoaded', function() {
    // Atualiza o nome do usuário no sidebar
    const user = getCurrentUser();
    if (user) {
      const userNameElement = document.querySelector('.sidebar-user-name');
      if (userNameElement) {
        userNameElement.textContent = user.name;
      }
    }

    // Adiciona evento ao botão de logout
    const logoutButton = document.querySelector('.sidebar-logout');
    if (logoutButton) {
      logoutButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Confirmação antes de sair
        if (confirm('Tem certeza que deseja sair?')) {
          logout();
        }
      });
    }
  });
}
