// ==========================================
// MENU HAMBÚRGUER - CONTROLE DA SIDEBAR MOBILE
// ==========================================

(function() {
  'use strict';

  // Elementos
  const hamburger = document.getElementById('hamburger');
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  const body = document.body;

  // Função para abrir o menu
  function openMenu() {
    sidebar.classList.add('sidebar-open');
    sidebarOverlay.classList.add('active');
    hamburger.classList.add('active');
    body.style.overflow = 'hidden'; // Previne scroll do body
  }

  // Função para fechar o menu
  function closeMenu() {
    sidebar.classList.remove('sidebar-open');
    sidebarOverlay.classList.remove('active');
    hamburger.classList.remove('active');
    body.style.overflow = ''; // Restaura scroll do body
  }

  // Função para alternar o menu
  function toggleMenu() {
    if (sidebar.classList.contains('sidebar-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  // Event Listeners
  if (hamburger) {
    hamburger.addEventListener('click', toggleMenu);
  }

  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', closeMenu);
  }

  // Fechar menu ao clicar em um item de navegação
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      // Só fecha o menu em telas mobile
      if (window.innerWidth <= 960) {
        closeMenu();
      }
    });
  });

  // Fechar menu ao pressionar ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('sidebar-open')) {
      closeMenu();
    }
  });

  // Fechar menu ao redimensionar para desktop
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth > 960) {
        closeMenu();
      }
    }, 250);
  });

  // Prevenir scroll do body quando sidebar está aberta
  sidebar.addEventListener('touchmove', (e) => {
    if (sidebar.classList.contains('sidebar-open')) {
      e.stopPropagation();
    }
  }, { passive: false });

})();
