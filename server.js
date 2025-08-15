const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Permitir que o backend entenda JSON no body das requisições
app.use(express.json());

// Exemplo de rota backend
app.get('/api/teste', (req, res) => {
    res.json({ mensagem: 'Backend funcionando com Node e Express!' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
