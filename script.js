// ==========================================
// UTILIDADES E CONFIGURAÇÕES GLOBAIS
// ==========================================

// CONFIGURAÇÃO DA LOGO
// Para adicionar sua logo, descomente e modifique a linha abaixo:
// setCustomLogo('URL_DA_SUA_IMAGEM_AQUI');

function setCustomLogo(imageUrl) {
  const logoContainer = document.getElementById('logoContainer');
  if (logoContainer && imageUrl) {
    logoContainer.innerHTML = `<img src="${imageUrl}" alt="Logo" />`;
  }
}

function rand(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function randFloat(min, max) {
  return Math.random() * (max - min) + min;
}

const departamentos = ['Desenvolvimento', 'Produto', 'Operações', 'Comercial', 'RH', 'TI', 'Financeiro', 'Logística'];
const temas = [
  'Ambiente de Trabalho',
  'Comunicação',
  'Desenvolvimento Profissional',
  'Carga de trabalho',
  'Comunicação com liderança',
  'Equilíbrio vida pessoal/profissional',
  'Reconhecimento',
  'Clima de equipe',
  'Pressão por metas'
];

const palavrasChave = [
  'estresse', 'pressão', 'cansaço', 'ansiedade', 'sobrecarga',
  'equipe', 'colaboração', 'suporte', 'desenvolvimento', 'crescimento',
  'comunicação', 'feedback', 'reconhecimento', 'metas', 'prazos',
  'flexibilidade', 'equilíbrio', 'bem-estar', 'saúde', 'motivação'
];

// Configuração padrão dos gráficos
Chart.defaults.font.family = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
Chart.defaults.color = '#4a5568';

// ==========================================
// NAVEGAÇÃO ENTRE PÁGINAS
// ==========================================

function initNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  const pages = document.querySelectorAll('.page-content');

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const pageId = item.getAttribute('data-page');
      
      // Remove active de todos os items
      navItems.forEach(nav => nav.classList.remove('active'));
      // Adiciona active no item clicado
      item.classList.add('active');
      
      // Esconde todas as páginas
      pages.forEach(page => page.classList.remove('active'));
      // Mostra a página selecionada
      const targetPage = document.getElementById(`page-${pageId}`);
      if (targetPage) {
        targetPage.classList.add('active');
        // Atualiza dados da página
        updatePage(pageId);
      }
    });
  });

  // Ativa a primeira página (overview) por padrão
  document.querySelector('.nav-item[data-page="overview"]').click();
}

// ==========================================
// ATUALIZAÇÃO DE PÁGINAS
// ==========================================

function updatePage(pageId) {
  switch(pageId) {
    case 'overview':
      updateOverview();
      break;
    case 'bem-estar':
      updateBemEstar();
      break;
    case 'estresse':
      updateEstresse();
      break;
    case 'burnout':
      updateBurnout();
      break;
  }
}

// ==========================================
// PÁGINA: OVERVIEW
// ==========================================

let overviewCharts = {};

function updateOverview() {
  // Gerar dados aleatórios para os indicadores
  const wellbeing = rand(60, 95);
  const stress = rand(3, 9);
  const burnoutNivel = rand(0, 2); // 0: Baixo, 1: Médio, 2: Alto
  const burnoutLabels = ['Baixo', 'Médio', 'Alto'];
  const totalInteracoes = rand(150, 500);
  const alertasCriticos = rand(0, 8);
  const sentimentoTrabalho = rand(55, 90);
  const sentimentoEmpresa = rand(50, 85);
  const sentimentoGestor = rand(50, 88);

  // Atualizar KPIs - Linha 1
  document.getElementById('kpiWellbeing').textContent = wellbeing + '%';
  document.getElementById('kpiStress').textContent = stress + '/10';
  document.getElementById('kpiBurnout').textContent = burnoutLabels[burnoutNivel];

  // Atualizar KPIs - Linha 2
  document.getElementById('kpiTotalInteracoes').textContent = totalInteracoes;
  document.getElementById('kpiAlertasCriticos').textContent = alertasCriticos;
  document.getElementById('kpiSentimentoTrabalho').textContent = sentimentoTrabalho + '%';
  document.getElementById('kpiSentimentoEmpresa').textContent = sentimentoEmpresa + '%';

  // Atualizar KPIs - Linha 3
  document.getElementById('kpiSentimentoGestor').textContent = sentimentoGestor + '%';

  // Atualizar trend
  const trendEl = document.getElementById('kpiWellbeingTrend');
  trendEl.textContent = wellbeing >= 70 ? '▲' : '▼';
  trendEl.classList.toggle('kpi-trend-up', wellbeing >= 70);
  trendEl.classList.toggle('kpi-trend-down', wellbeing < 70);

  // Gráficos
  createSetoresComparacaoChart();
  createOverviewBurnoutChart();
  createSentimentosOverviewChart();
  createTemasOverviewChart();
}

function createSetoresComparacaoChart() {
  const ctx = document.getElementById('chartSetoresComparacao');
  if (!ctx) return;

  if (overviewCharts.setores) {
    overviewCharts.setores.destroy();
  }

  const data = departamentos.map(() => rand(50, 95));

  overviewCharts.setores = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: departamentos,
      datasets: [{
        label: 'Bem-estar (%)',
        data: data,
        backgroundColor: departamentos.map((_, idx) => {
          const value = data[idx];
          if (value >= 80) return 'rgba(72, 187, 120, 0.8)';
          if (value >= 60) return 'rgba(246, 173, 85, 0.8)';
          return 'rgba(245, 101, 101, 0.8)';
        }),
        borderColor: departamentos.map((_, idx) => {
          const value = data[idx];
          if (value >= 80) return 'rgb(72, 187, 120)';
          if (value >= 60) return 'rgb(246, 173, 85)';
          return 'rgb(245, 101, 101)';
        }),
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 2,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            callback: function(value) {
              return value + '%';
            }
          }
        }
      }
    }
  });
}

function createOverviewBurnoutChart() {
  const ctx = document.getElementById('chartOverviewBurnout');
  if (!ctx) return;

  if (overviewCharts.burnout) {
    overviewCharts.burnout.destroy();
  }

  const low = rand(40, 60);
  const mid = rand(20, 35);
  const high = 100 - low - mid;

  overviewCharts.burnout = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Baixo', 'Médio', 'Alto'],
      datasets: [{
        data: [low, mid, high],
        backgroundColor: [
          'rgb(72, 187, 120)',
          'rgb(246, 173, 85)',
          'rgb(245, 101, 101)'
        ],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 2,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 15,
            font: {
              size: 12
            }
          }
        }
      }
    }
  });
}

function createSentimentosOverviewChart() {
  const ctx = document.getElementById('chartSentimentosOverview');
  if (!ctx) return;

  if (overviewCharts.sentimentos) {
    overviewCharts.sentimentos.destroy();
  }

  const positivo = rand(40, 70);
  const neutro = rand(15, 30);
  const negativo = 100 - positivo - neutro;

  overviewCharts.sentimentos = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Positivo', 'Neutro', 'Negativo'],
      datasets: [{
        data: [positivo, neutro, negativo],
        backgroundColor: [
          'rgb(72, 187, 120)',
          'rgb(66, 153, 225)',
          'rgb(245, 101, 101)'
        ],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 2,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 15,
            font: {
              size: 12
            }
          }
        }
      }
    }
  });
}

function createTemasOverviewChart() {
  const ctx = document.getElementById('chartTemasOverview');
  if (!ctx) return;

  if (overviewCharts.temas) {
    overviewCharts.temas.destroy();
  }

  const temasTop = temas.slice(0, 5);
  const data = temasTop.map(() => rand(15, 35));

  overviewCharts.temas = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: temasTop,
      datasets: [{
        label: 'Menções (%)',
        data: data,
        backgroundColor: 'rgba(102, 126, 234, 0.8)',
        borderColor: 'rgb(102, 126, 234)',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 2,
      indexAxis: 'y',
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return value + '%';
            }
          }
        }
      }
    }
  });
}

// ==========================================
// PÁGINA: BEM-ESTAR
// ==========================================

let bemEstarCharts = {};

function updateBemEstar() {
  const bemEstarMedio = rand(40, 90);
  const variacao = rand(-15, 20);
  
  document.getElementById('kpiBemEstarMedio').textContent = bemEstarMedio + '%';
  document.getElementById('kpiBemEstarVariacao').textContent = (variacao > 0 ? '+' : '') + variacao + '%';

  createBemEstarSetoresChart();
  createBemEstarDistribuicaoChart();
  generateBemEstarInsights(bemEstarMedio);
}

function createBemEstarSetoresChart() {
  const ctx = document.getElementById('chartBemEstarSetores');
  if (!ctx) return;

  if (bemEstarCharts.setores) {
    bemEstarCharts.setores.destroy();
  }

  const data = departamentos.map(() => rand(40, 95));

  bemEstarCharts.setores = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: departamentos,
      datasets: [{
        label: 'Bem-estar (%)',
        data: data,
        backgroundColor: 'rgba(72, 187, 120, 0.8)',
        borderColor: 'rgb(72, 187, 120)',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 2,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            callback: function(value) {
              return value + '%';
            }
          }
        }
      }
    }
  });
}

function createBemEstarDistribuicaoChart() {
  const ctx = document.getElementById('chartBemEstarDistribuicao');
  if (!ctx) return;

  if (bemEstarCharts.distribuicao) {
    bemEstarCharts.distribuicao.destroy();
  }

  const alto = rand(30, 50);
  const medio = rand(30, 45);
  const baixo = 100 - alto - medio;

  bemEstarCharts.distribuicao = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Alto (>80%)', 'Médio (50-80%)', 'Baixo (<50%)'],
      datasets: [{
        data: [alto, medio, baixo],
        backgroundColor: [
          'rgb(72, 187, 120)',
          'rgb(246, 173, 85)',
          'rgb(245, 101, 101)'
        ],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 2.5,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 15,
            font: {
              size: 12
            }
          }
        }
      }
    }
  });
}

function generateBemEstarInsights(media) {
  const container = document.getElementById('insightsBemEstar');
  if (!container) return;

  container.innerHTML = '';

  if (media < 50) {
    container.innerHTML = `
      <div class="insight-card insight-critical">
        <div class="insight-title">⚠️ Nível de Bem-estar Crítico</div>
        <div class="insight-text">
          O bem-estar geral está abaixo de 50%, indicando necessidade urgente de intervenção. Vários setores necessitam de atenção imediata.
        </div>
        <div class="insight-actions">
          <div class="insight-actions-title">💡 Ações Urgentes:</div>
          <ul>
            <li>Realizar pesquisa de clima organizacional detalhada</li>
            <li>Implementar programas de suporte psicológico</li>
            <li>Revisar carga de trabalho e processos</li>
            <li>Promover diálogo aberto com liderança</li>
            <li>Criar plano de ação imediato por setor</li>
          </ul>
        </div>
      </div>
    `;
  } else if (media < 70) {
    container.innerHTML = `
      <div class="insight-card insight-warning">
        <div class="insight-title">😐 Bem-estar Precisa de Atenção</div>
        <div class="insight-text">
          O nível de bem-estar está abaixo do ideal. Há oportunidades significativas de melhoria na experiência dos colaboradores.
        </div>
        <div class="insight-actions">
          <div class="insight-actions-title">💡 Ações Recomendadas:</div>
          <ul>
            <li>Implementar programas de qualidade de vida</li>
            <li>Fortalecer comunicação e feedback</li>
            <li>Revisar benefícios e políticas</li>
            <li>Promover atividades de integração</li>
            <li>Oferecer treinamentos de desenvolvimento</li>
          </ul>
        </div>
      </div>
    `;
  } else {
    container.innerHTML = `
      <div class="insight-card insight-success">
        <div class="insight-title">😊 Excelente Nível de Bem-estar</div>
        <div class="insight-text">
          O bem-estar geral está em níveis positivos. Continue cultivando este ambiente saudável e engajado.
        </div>
        <div class="insight-actions">
          <div class="insight-actions-title">💡 Manutenção:</div>
          <ul>
            <li>Manter canais de escuta ativa</li>
            <li>Continuar reconhecendo conquistas</li>
            <li>Investir em desenvolvimento de pessoas</li>
            <li>Promover cultura de feedback positivo</li>
            <li>Monitorar indicadores regularmente</li>
          </ul>
        </div>
      </div>
    `;
  }
}

// ==========================================
// PÁGINA: ESTRESSE
// ==========================================

let estresseCharts = {};

function updateEstresse() {
  const estresseMedio = rand(3, 9);
  const sobrecarga = rand(3, 9);
  const altoEstresse = rand(10, 40);

  document.getElementById('kpiEstresseMedio').textContent = estresseMedio + '/10';
  document.getElementById('kpiSobrecargaMedia').textContent = sobrecarga + '/10';
  document.getElementById('kpiEstresseAlto').textContent = altoEstresse + '%';

  createEstresseSetoresChart();
  createEstresseDistribuicaoChart();
  generateEstresseInsights(estresseMedio);
}

function createEstresseSetoresChart() {
  const ctx = document.getElementById('chartEstresseSetores');
  if (!ctx) return;

  if (estresseCharts.setores) {
    estresseCharts.setores.destroy();
  }

  const data = departamentos.map(() => rand(3, 9));

  estresseCharts.setores = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: departamentos,
      datasets: [{
        label: 'Estresse (0-10)',
        data: data,
        backgroundColor: data.map(value => {
          if (value >= 7) return 'rgba(245, 101, 101, 0.8)';
          if (value >= 5) return 'rgba(246, 173, 85, 0.8)';
          return 'rgba(72, 187, 120, 0.8)';
        }),
        borderColor: data.map(value => {
          if (value >= 7) return 'rgb(245, 101, 101)';
          if (value >= 5) return 'rgb(246, 173, 85)';
          return 'rgb(72, 187, 120)';
        }),
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 2,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 10,
          ticks: {
            callback: function(value) {
              return value + '/10';
            }
          }
        }
      }
    }
  });
}

function createEstresseDistribuicaoChart() {
  const ctx = document.getElementById('chartEstresseDistribuicao');
  if (!ctx) return;

  if (estresseCharts.distribuicao) {
    estresseCharts.distribuicao.destroy();
  }

  const baixo = rand(30, 50);
  const medio = rand(25, 40);
  const alto = 100 - baixo - medio;

  estresseCharts.distribuicao = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Baixo (0-4)', 'Médio (5-7)', 'Alto (8-10)'],
      datasets: [{
        data: [baixo, medio, alto],
        backgroundColor: [
          'rgb(72, 187, 120)',
          'rgb(246, 173, 85)',
          'rgb(245, 101, 101)'
        ],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 2.5,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 15,
            font: {
              size: 12
            }
          }
        }
      }
    }
  });
}

function generateEstresseInsights(nivel) {
  const container = document.getElementById('insightsEstresse');
  if (!container) return;

  container.innerHTML = '';

  if (nivel >= 7) {
    container.innerHTML = `
      <div class="insight-card insight-critical">
        <div class="insight-title">🚨 Nível de Estresse Crítico</div>
        <div class="insight-text">
          O estresse médio está em nível crítico (${nivel}/10). Isso pode levar a problemas de saúde, burnout e queda na produtividade.
        </div>
        <div class="insight-actions">
          <div class="insight-actions-title">💡 Ações Urgentes:</div>
          <ul>
            <li>Revisar imediatamente cargas de trabalho</li>
            <li>Implementar pausas obrigatórias</li>
            <li>Oferecer suporte psicológico emergencial</li>
            <li>Avaliar redistribuição de tarefas</li>
            <li>Reduzir prazos não essenciais</li>
          </ul>
        </div>
      </div>
    `;
  } else if (nivel >= 5) {
    container.innerHTML = `
      <div class="insight-card insight-warning">
        <div class="insight-title">⚠️ Estresse em Nível de Atenção</div>
        <div class="insight-text">
          O estresse está em nível médio-alto (${nivel}/10). É importante implementar medidas preventivas antes que se agrave.
        </div>
        <div class="insight-actions">
          <div class="insight-actions-title">💡 Ações Recomendadas:</div>
          <ul>
            <li>Implementar programas de gestão de estresse</li>
            <li>Oferecer workshops de mindfulness</li>
            <li>Revisar processos e eliminar gargalos</li>
            <li>Promover pausas e intervalos regulares</li>
            <li>Melhorar comunicação sobre expectativas</li>
          </ul>
        </div>
      </div>
    `;
  } else {
    container.innerHTML = `
      <div class="insight-card insight-success">
        <div class="insight-title">✅ Estresse Sob Controle</div>
        <div class="insight-text">
          O nível de estresse está em patamar saudável (${nivel}/10). Continue monitorando para manter este equilíbrio.
        </div>
        <div class="insight-actions">
          <div class="insight-actions-title">💡 Manutenção:</div>
          <ul>
            <li>Manter práticas atuais de gestão</li>
            <li>Continuar promovendo pausas</li>
            <li>Monitorar picos de trabalho</li>
            <li>Oferecer recursos de bem-estar</li>
            <li>Reconhecer boa gestão de tempo</li>
          </ul>
        </div>
      </div>
    `;
  }
}

// ==========================================
// PÁGINA: BURNOUT
// ==========================================

let burnoutCharts = {};

function updateBurnout() {
  const baixo = rand(40, 65);
  const medio = rand(20, 35);
  const alto = 100 - baixo - medio;

  document.getElementById('kpiBurnoutBaixo').textContent = baixo + '%';
  document.getElementById('kpiBurnoutMedio').textContent = medio + '%';
  document.getElementById('kpiBurnoutAlto').textContent = alto + '%';

  createBurnoutSetoresChart();
  generateBurnoutInsights(alto);
}

function createBurnoutSetoresChart() {
  const ctx = document.getElementById('chartBurnoutSetores');
  if (!ctx) return;

  if (burnoutCharts.setores) {
    burnoutCharts.setores.destroy();
  }

  // Gerar valores de risco alto para cada setor (10-70%)
  const riscoAltoData = departamentos.map(() => rand(10, 70));
  
  // Definir cor de cada barra baseado no valor
  const backgroundColors = riscoAltoData.map(valor => {
    if (valor < 40) return 'rgba(72, 187, 120, 0.8)'; // Verde - Baixo
    if (valor < 70) return 'rgba(246, 173, 85, 0.8)'; // Laranja - Médio  
    return 'rgba(245, 101, 101, 0.8)'; // Vermelho - Alto
  });

  const borderColors = riscoAltoData.map(valor => {
    if (valor < 40) return 'rgb(72, 187, 120)'; // Verde
    if (valor < 70) return 'rgb(246, 173, 85)'; // Laranja
    return 'rgb(245, 101, 101)'; // Vermelho
  });

  burnoutCharts.setores = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: departamentos,
      datasets: [
        {
          label: 'Risco de Burnout (%)',
          data: riscoAltoData,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 2,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            callback: function(value) {
              return value + '%';
            }
          }
        }
      }
    }
  });
}

function generateBurnoutInsights(altoRisco) {
  const container = document.getElementById('insightsBurnout');
  if (!container) return;

  container.innerHTML = '';

  if (altoRisco > 20) {
    container.innerHTML = `
      <div class="insight-card insight-critical">
        <div class="insight-title">🚨 Alto Risco de Burnout Detectado</div>
        <div class="insight-text">
          ${altoRisco}% dos colaboradores apresentam alto risco de burnout. Isso representa um problema crítico que requer atenção imediata.
        </div>
        <div class="insight-actions">
          <div class="insight-actions-title">💡 Ações Urgentes:</div>
          <ul>
            <li>Implementar programa de prevenção de burnout</li>
            <li>Oferecer suporte psicológico especializado</li>
            <li>Revisar cargas de trabalho imediatamente</li>
            <li>Promover pausas obrigatórias e férias</li>
            <li>Treinar gestores sobre sinais de burnout</li>
            <li>Criar política de trabalho sustentável</li>
          </ul>
        </div>
      </div>
    `;
  } else if (altoRisco > 10) {
    container.innerHTML = `
      <div class="insight-card insight-warning">
        <div class="insight-title">⚠️ Atenção ao Risco de Burnout</div>
        <div class="insight-text">
          ${altoRisco}% dos colaboradores apresentam risco elevado de burnout. Medidas preventivas são necessárias para evitar agravamento.
        </div>
        <div class="insight-actions">
          <div class="insight-actions-title">💡 Ações Recomendadas:</div>
          <ul>
            <li>Implementar programas de gestão de estresse</li>
            <li>Oferecer recursos de saúde mental</li>
            <li>Promover equilíbrio vida-trabalho</li>
            <li>Revisar metas e expectativas</li>
            <li>Criar cultura de apoio mútuo</li>
          </ul>
        </div>
      </div>
    `;
  } else {
    container.innerHTML = `
      <div class="insight-card insight-success">
        <div class="insight-title">✅ Risco de Burnout Controlado</div>
        <div class="insight-text">
          Apenas ${altoRisco}% dos colaboradores apresentam alto risco. A maioria está em níveis saudáveis de engajamento.
        </div>
        <div class="insight-actions">
          <div class="insight-actions-title">💡 Manutenção:</div>
          <ul>
            <li>Manter práticas atuais de bem-estar</li>
            <li>Continuar monitorando indicadores</li>
            <li>Promover cultura de saúde mental</li>
            <li>Reconhecer equilíbrio saudável</li>
            <li>Oferecer recursos preventivos</li>
          </ul>
        </div>
      </div>
    `;
  }
}

// ==========================================
// BOTÕES DE ATUALIZAÇÃO
// ==========================================

function initRefreshButtons() {
  const refreshButtons = document.querySelectorAll('.btn-refresh');
  refreshButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const activePage = document.querySelector('.page-content.active');
      if (activePage) {
        const pageId = activePage.id.replace('page-', '');
        updatePage(pageId);
      }
    });
  });
}

// ==========================================
// INICIALIZAÇÃO
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initRefreshButtons();
  
  // Carrega a página inicial
  updateOverview();
});
