const productsGrid = document.getElementById('productsGrid');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotalElement = document.getElementById('cartTotal');
const checkoutButton = document.getElementById('checkoutButton');
const emptyCartMessage = document.getElementById('emptyCartMessage');

let cart = [];

function formatCurrency(value) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

async function carregarItens() {
  if (!productsGrid) return;

  productsGrid.innerHTML = '<p class="loading-text">Carregando produtos...</p>';

  try {
    const response = await fetch('/api/itens');
    const resultado = await response.json();

    if (!response.ok || !resultado.success) {
      productsGrid.innerHTML = `<p class="loading-text">${resultado.message || 'Não foi possível carregar os produtos.'}</p>`;
      return;
    }

    const itens = resultado.data;

    if (!Array.isArray(itens) || itens.length === 0) {
      productsGrid.innerHTML = '<p class="loading-text">Nenhum produto encontrado.</p>';
      return;
    }

    productsGrid.innerHTML = itens.map((item) => `
      <article class="product-card">
        <img src="${item.imagem}" alt="${item.nome}" class="product-image">
        <div class="product-info">
          <h3>${item.nome}</h3>
          <p class="product-price">${formatCurrency(item.preco)}</p>
          <button
            type="button"
            class="btn btn-primary"
            data-id="${item.id}"
            data-name="${item.nome}"
            data-price="${item.preco}"
          >
            Comprar
          </button>
        </div>
      </article>
    `).join('');

    ativarBotoesCompra();
  } catch (error) {
    productsGrid.innerHTML = '<p class="loading-text">Erro de conexão com o servidor.</p>';
    console.error('Erro ao carregar itens:', error);
  }
}

function ativarBotoesCompra() {
  const botoes = document.querySelectorAll('.product-card .btn-primary');

  botoes.forEach((botao) => {
    botao.addEventListener('click', () => {
      const id = Number(botao.dataset.id);
      const nome = botao.dataset.name;
      const preco = Number(botao.dataset.price);

      adicionarAoCarrinho(id, nome, preco);
    });
  });
}

function adicionarAoCarrinho(id, nome, preco) {
  const itemExistente = cart.find((item) => item.id === id);

  if (itemExistente) {
    itemExistente.quantidade += 1;
  } else {
    cart.push({
      id,
      nome,
      preco,
      quantidade: 1
    });
  }

  renderizarCarrinho();
}

function removerDoCarrinho(id) {
  cart = cart
    .map((item) => {
      if (item.id === id) {
        return { ...item, quantidade: item.quantidade - 1 };
      }
      return item;
    })
    .filter((item) => item.quantidade > 0);

  renderizarCarrinho();
}

function renderizarCarrinho() {
  if (!cartItemsContainer || !cartTotalElement) return;

  if (cart.length === 0) {
    if (emptyCartMessage) {
      emptyCartMessage.style.display = 'block';
    }

    cartItemsContainer.innerHTML = '';
    cartTotalElement.textContent = formatCurrency(0);

    if (checkoutButton) {
      checkoutButton.disabled = true;
    }

    return;
  }

  if (emptyCartMessage) {
    emptyCartMessage.style.display = 'none';
  }

  cartItemsContainer.innerHTML = cart.map((item) => `
    <div class="cart-item">
      <div>
        <strong>${item.nome}</strong>
        <p>${item.quantidade} x ${formatCurrency(item.preco)}</p>
      </div>
      <button
        type="button"
        class="btn btn-secondary remove-item-button"
        data-id="${item.id}"
      >
        Remover
      </button>
    </div>
  `).join('');

  const total = cart.reduce((acc, item) => {
    return acc + (item.preco * item.quantidade);
  }, 0);

  cartTotalElement.textContent = formatCurrency(total);

  if (checkoutButton) {
    checkoutButton.disabled = false;
  }

  ativarBotoesRemocao();
}

function ativarBotoesRemocao() {
  const botoesRemover = document.querySelectorAll('.remove-item-button');

  botoesRemover.forEach((botao) => {
    botao.addEventListener('click', () => {
      const id = Number(botao.dataset.id);
      removerDoCarrinho(id);
    });
  });
}

function finalizarPedido() {
  if (cart.length === 0) {
    alert('Seu carrinho está vazio.');
    return;
  }

  const resumo = cart.map((item) => {
    return `${item.nome} - ${item.quantidade} unidade(s)`;
  }).join('\n');

  alert(`Pedido realizado com sucesso!\n\nItens:\n${resumo}`);

  cart = [];
  renderizarCarrinho();
}

document.addEventListener('DOMContentLoaded', () => {
  carregarItens();
  renderizarCarrinho();

  if (checkoutButton) {
    checkoutButton.addEventListener('click', finalizarPedido);
  }
});