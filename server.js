require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

// Importa o modelo Cliente
const Cliente = require('./models/Cliente');

const app = express();
const PORT = 3000;

// Conexão com o MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB conectado com sucesso!'))
  .catch(err => console.error('❌ Erro ao conectar no MongoDB:', err));

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para o backend entender JSON no body das requisições
app.use(express.json());

// Rota de teste (já existia)
app.get('/api/teste', (req, res) => {
  res.json({ mensagem: 'Backend funcionando com Node, Express e MongoDB!' });
});

// 🔹 Rota para listar clientes
app.get('/api/clientes', async (req, res) => {
  try {
    const clientes = await Cliente.find();
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar clientes' });
  }
});

// 🔹 Rota para adicionar cliente
app.post('/api/clientes', async (req, res) => {
  try {
    const cliente = new Cliente(req.body);
    await cliente.save();
    res.status(201).json(cliente);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// rota para buscar um cliente pelo nome
app.get('/api/clientes/:nome', async (req, res) => {
  try {
    const { nome } = req.params;
    const cliente = await Cliente.findOne({ nome: nome });

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    res.json(cliente);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar cliente' });
  }
});

// 🔹 Rota para buscar um cliente específico pelo nome
app.get('/api/clientes/:nome', async (req, res) => {
  try {
    const { nome } = req.params;
    const cliente = await Cliente.findOne({ nome: nome });

    if (!cliente) {
      return res.status(404).json({ mensagem: 'Cliente não encontrado' });
    }

    res.json(cliente);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar cliente', detalhe: error.message });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
