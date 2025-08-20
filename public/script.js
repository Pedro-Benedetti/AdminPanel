document.addEventListener('DOMContentLoaded', function () {
    const transactionsTable = document.getElementById('transactionsTable');
    const lucroTotalEl = document.getElementById('lucroTotal');
    const prejuizoTotalEl = document.getElementById('prejuizoTotal');
    const saldoLiquidoEl = document.getElementById('saldoLiquido');

    // ===== Buscar dados do backend =====
    async function loadData() {
        try {
            const res = await fetch('/api/clientes');
            const data = await res.json();

            if (!Array.isArray(data)) {
                console.error("Erro: API não retornou array:", data);
                return;
            }

            updateTable(data);
            updateStats(data);
            renderChart(data);

        } catch (err) {
            console.error("Erro ao carregar dados:", err);
            transactionsTable.innerHTML = `<tr><td colspan="5">Erro ao carregar dados</td></tr>`;
        }
    }

    // ===== Atualizar tabela =====
    function updateTable(data) {
        if (data.length === 0) {
            transactionsTable.innerHTML = `<tr><td colspan="5">Nenhuma transação encontrada</td></tr>`;
            return;
        }

        transactionsTable.innerHTML = data.map(item => `
            <tr>
                <td class="client-name">${item.nome}</td>
                <td><span class="badge ${item.tipo === "lucro" ? "profit-badge" : "loss-badge"}">${item.tipo}</span></td>
                <td class="amount ${item.tipo === "lucro" ? "profit" : "loss"}">${formatCurrency(item.valor)}</td>
                <td class="date">${formatDate(item.data)}</td>
                <td><span class="badge ${statusBadge(item.status)}">${item.status}</span></td>
            </tr>
        `).join("");
    }

    // ===== Atualizar estatísticas =====
    function updateStats(data) {
        const lucro = data.filter(i => i.tipo === "lucro").reduce((acc, i) => acc + i.valor, 0);
        const prejuizo = data.filter(i => i.tipo === "prejuizo").reduce((acc, i) => acc + i.valor, 0);
        const saldo = lucro - prejuizo;

        lucroTotalEl.textContent = formatCurrency(lucro);
        prejuizoTotalEl.textContent = formatCurrency(prejuizo);
        saldoLiquidoEl.textContent = formatCurrency(saldo);
    }

    // ===== Renderizar gráfico =====
    function renderChart(data) {
        const clientes = data.map(i => i.nome);
        const lucros = data.map(i => i.tipo === "lucro" ? i.valor : 0);
        const prejuizos = data.map(i => i.tipo === "prejuizo" ? i.valor : 0);

        // opções do gráfico
        const chartOptions = {
        chart: {
        type: 'bar',
        height: 350,
        toolbar: { show: true }
         },
        plotOptions: {
        bar: {
        borderRadius: 8,
        horizontal: false,
        columnWidth: '55%',
           },
         },
        dataLabels: {
        enabled: true,
        style: {
        colors: ['#fff']
           }
         },
        xaxis: {
        categories: [], // vai ser preenchido dinamicamente
        labels: {
        style: {
        fontSize: '14px',
        fontWeight: 600
     }
           }
         },
        yaxis: {
        labels: {
        style: {
        fontSize: '14px'
              }
           }
         },
        colors: ['#00E396', '#FF4560'],
        legend: {
        position: 'top'
         },
        tooltip: {
        theme: 'dark'
         }
     };

    // cria o gráfico
    const chart = new ApexCharts(document.querySelector("#chart"), chartOptions);
    chart.render();

    }

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
