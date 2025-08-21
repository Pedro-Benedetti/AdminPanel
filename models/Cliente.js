const mongoose = require('mongoose');

const TransacaoSchema = new mongoose.Schema({
  tipo: { type: String, enum: ['lucro', 'prejuizo'], required: true },
  valor: { type: Number, required: true },
  data: { type: Date, default: Date.now }
});

const ClienteSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  transacoes: [TransacaoSchema],
  status: { type: String, enum: ['concluido', 'pendente', 'em análise'], required: true }
});

module.exports = mongoose.model('Cliente', ClienteSchema, 'clientes');
