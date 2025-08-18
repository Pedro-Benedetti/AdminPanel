const mongoose = require('mongoose');

const ClienteSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  tipo: { type: String, enum: ['lucro', 'prejuizo'], required: true },
  valor: { type: Number, required: true },
  data: { type: Date, default: Date.now },
  status: { type: String, enum: ['concluido', 'pendente', 'em analise'], required: true }
});

module.exports = mongoose.model('Cliente', ClienteSchema);
