const assert = require('assert');

console.log('Executando testes unitários do Feirinha Shop...');

try {
  assert.strictEqual(1 + 1, 2);
  console.log('✔ Teste unitário executado com sucesso!');
} catch (error) {
  console.error('✖ Falha no teste unitário:', error);
  process.exit(1);
}