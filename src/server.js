const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/itens', (req, res) => {
  try {
    const filePath = path.join(__dirname, 'data', 'itens.json');
    const itens = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    res.status(200).json({
      success: true,
      message: 'Itens carregados com sucesso.',
      data: itens
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao carregar os itens.'
    });
  }
});

app.get('/pedido', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pedido.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada.'
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});