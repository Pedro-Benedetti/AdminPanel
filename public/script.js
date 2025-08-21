document.addEventListener('DOMContentLoaded', function () {
const transactionsTable = document.getElementById('transactionsTable');
const lucroTotalEl = document.getElementById('lucroTotal');
const prejuizoTotalEl = document.getElementById('prejuizoTotal');
const saldoLiquidoEl = document.getElementById('saldoLiquido');
const filtroStatusEl = document.getElementById('filtro-status');
const filtroNomeEl = document.getElementById('filtro-nome');

    let chart; // variável global para o gráfico
    let clientesCache = []; // cache dos dados do backend

    // ===== Buscar dados do backend =====
    async function loadData() {
        try {
            const res = await fetch('/api/clientes');
            const data = await res.json();

            if (!Array.isArray(data)) {
                console.error("Erro: API não retornou array:", data);
                return;
            }

            clientesCache = data;

            preencherFiltroNomes(data);
            updateTable(data);
            updateStats(data);
            initChart();
            applyFilter();

        } catch (err) {
            console.error("Erro ao carregar dados:", err);
            transactionsTable.innerHTML = `<tr><td colspan="5">Erro ao carregar dados</td></tr>`;
        }
    }

    // ===== Preencher select de nomes =====
    function preencherFiltroNomes(data) {
        filtroNomeEl.innerHTML = `<option value="todos">Todos</option>`;
        data.forEach(c => {
            const option = document.createElement('option');
            option.value = c.nome;
            option.textContent = c.nome;
            filtroNomeEl.appendChild(option);
        });
    }

    // ===== Atualizar tabela =====
    function updateTable(data) {
        const rows = [];
        data.forEach(cliente => {
            cliente.transacoes.forEach(t => {
                rows.push(`
                    <tr>
                        <td class="client-name">${cliente.nome}</td>
                        <td><span class="badge ${t.tipo === "lucro" ? "profit-badge" : "loss-badge"}">${t.tipo}</span></td>
                        <td class="amount ${t.tipo === "lucro" ? "profit" : "loss"}">${formatCurrency(t.valor)}</td>
                        <td class="date">${formatDate(t.data)}</td>
                        <td><span class="badge ${statusBadge(cliente.status)}">${cliente.status}</span></td>
                    </tr>
                `);
            });
        });

        transactionsTable.innerHTML = rows.length > 0 ? rows.join("") :
            `<tr><td colspan="5">Nenhuma transação encontrada</td></tr>`;
    }

    // ===== Atualizar estatísticas =====
    function updateStats(data) {
        let lucro = 0;
        let prejuizo = 0;

        data.forEach(cliente => {
            cliente.transacoes.forEach(t => {
                if (t.tipo === "lucro") lucro += t.valor;
                if (t.tipo === "prejuizo") prejuizo += t.valor;
            });
        });

        const saldo = lucro - prejuizo;

        lucroTotalEl.textContent = formatCurrency(lucro);
        prejuizoTotalEl.textContent = formatCurrency(prejuizo);
        saldoLiquidoEl.textContent = formatCurrency(saldo);
    }

    // ===== Inicializar gráfico (linha 📈) =====
    function initChart() {
        const options = {
            chart: {
                type: 'line',
                height: 350,
                toolbar: { show: true }
            },
            stroke: { curve: 'smooth', width: 3 },
            markers: { size: 6 },
            dataLabels: { enabled: true },
            xaxis: { categories: [] },
            tooltip: { theme: 'dark' },
            colors: ['#00E396'],
            series: [{ name: "Histórico", data: [] }]
        };

        chart = new ApexCharts(document.querySelector("#chart"), options);
        chart.render();
    }

    // ===== Aplicar filtros no gráfico =====
    function applyFilter() {
        const filtroStatus = filtroStatusEl.value;
        const filtroNome = filtroNomeEl.value;

        let filtrados = clientesCache;

        // Filtro por status
        if (filtroStatus !== 'todos') {
            filtrados = filtrados.filter(c => c.status === filtroStatus);
        }

        let categorias = [];
        let valores = [];

        if (filtroNome !== 'todos') {
            // Histórico de um cliente
            const cliente = filtrados.find(c => c.nome === filtroNome);
            if (cliente) {
                categorias = cliente.transacoes.map(t => formatDate(t.data));
                valores = cliente.transacoes.map(t => t.tipo === "lucro" ? t.valor : -t.valor);
            }
        } else {
            // Soma por cliente
            categorias = filtrados.map(c => c.nome);
            valores = filtrados.map(c =>
                c.transacoes.reduce((acc, t) => acc + (t.tipo === "lucro" ? t.valor : -t.valor), 0)
            );
        }

        chart.updateOptions({ xaxis: { categories } });
        chart.updateSeries([{ name: "Histórico", data: valores }]);
    }

    // eventos
    filtroStatusEl.addEventListener('change', applyFilter);
    filtroNomeEl.addEventListener('change', applyFilter);

    // ===== Helpers =====
    function formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }

    function formatDate(date) {
        return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
    }

    function statusBadge(status) {
        switch (status) {
            case "concluido": return "completed-badge";
            case "pendente": return "pending-badge";
            case "em análise": return "analysis-badge";
            default: return "";
        }
    }

    // Carregar os dados ao iniciar
    loadData();
});