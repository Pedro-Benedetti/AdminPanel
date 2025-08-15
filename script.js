document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const menuToggle = document.getElementById('menuToggle');
    const closeSidebar = document.getElementById('closeSidebar');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const navItems = document.querySelectorAll('.nav-item');

    // Controle do menu lateral mobile
    function openSidebar() {
        sidebar.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeSidebarMenu() {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Event listeners para o menu
    if (menuToggle) {
        menuToggle.addEventListener('click', openSidebar);
    }

    if (closeSidebar) {
        closeSidebar.addEventListener('click', closeSidebarMenu);
    }

    if (overlay) {
        overlay.addEventListener('click', closeSidebarMenu);
    }

    // Navegação do menu lateral
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove classe active de todos os itens
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Adiciona classe active ao item clicado
            this.classList.add('active');
            
            // Fecha o menu em mobile
            if (window.innerWidth <= 768) {
                closeSidebarMenu();
            }
            
            // TODO: Aqui será implementada a lógica de navegação entre seções
            console.log('Navegando para:', this.querySelector('span:last-child').textContent);
        });
    });

    // Controle de responsividade
    function handleResize() {
        if (window.innerWidth > 768) {
            closeSidebarMenu();
            sidebar.classList.remove('active');
        }
    }

    window.addEventListener('resize', handleResize);

    // Escape key para fechar menu
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeSidebarMenu();
        }
    });

    /* ========================================
       PLACEHOLDER PARA FUTURAS INTEGRAÇÕES
       ======================================== */

    // TODO: Integração com biblioteca de gráficos (Chart.js, D3.js, etc.)
    function initializeCharts() {
        // Esta função será implementada para inicializar gráficos dinâmicos
        console.log('Charts placeholder - ready for integration');
        
        // Exemplo de estrutura para futura integração:
        /*
        const chartContainer = document.querySelector('.chart-placeholder');
        if (chartContainer) {
            // Inicializar gráfico aqui
            // new Chart(chartContainer, chartConfig);
        }
        */
    }

    // TODO: Integração com dados dinâmicos da tabela
    function initializeDataTable() {
        // Esta função será implementada para carregar dados dinâmicos
        console.log('Data table placeholder - ready for integration');
        
        // Exemplo de estrutura para futura integração:
        /*
        fetch('/api/financial-data')
            .then(response => response.json())
            .then(data => {
                updateTable(data);
            });
        */
    }

    // TODO: Sistema de busca
    function initializeSearch() {
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('input', function(e) {
                const searchTerm = e.target.value.toLowerCase();
                console.log('Searching for:', searchTerm);
                
                // TODO: Implementar lógica de busca
                // filterTableData(searchTerm);
            });
        }
    }

    // TODO: Filtros dinâmicos
    function initializeFilters() {
        // Esta função será implementada para filtros por tipo, data, etc.
        console.log('Filters placeholder - ready for integration');
    }

    // TODO: Exportação de dados
    function initializeExport() {
        // Esta função será implementada para exportar relatórios
        console.log('Export functionality placeholder - ready for integration');
    }

    // TODO: Notificações em tempo real
    function initializeNotifications() {
        // Esta função será implementada para notificações de novas transações
        console.log('Notifications placeholder - ready for integration');
    }

    // TODO: Modo dark/light (opcional)
    function initializeThemeToggle() {
        // Esta função poderá ser implementada para alternar temas
        console.log('Theme toggle placeholder - ready for integration');
    }

    // Inicializar funcionalidades básicas
    initializeCharts();
    initializeDataTable();
    initializeSearch();
    initializeFilters();
    initializeExport();
    initializeNotifications();

    console.log('Admin Panel initialized successfully');
});

/* ========================================
   UTILITÁRIOS PARA FUTURAS INTEGRAÇÕES
   ======================================== */

// Função para formatar valores monetários
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

// Função para formatar datas
function formatDate(date) {
    return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
}

// Função para debounce (útil para busca)
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Função para detectar dispositivo móvel
function isMobile() {
    return window.innerWidth <= 768;
}

// Função para detectar tablet
function isTablet() {
    return window.innerWidth > 768 && window.innerWidth <= 1024;
}

// Função para mostrar loading
function showLoading(element) {
    if (element) {
        element.innerHTML = '<div style="text-align: center; padding: 2rem; color: #646465;">Carregando...</div>';
    }
}

// Função para esconder loading
function hideLoading(element, originalContent) {
    if (element) {
        element.innerHTML = originalContent;
    }
}