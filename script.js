// Carrossel
let slideIndex = 0;

function moveSlide(n) {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');

    slides[slideIndex].classList.remove('active');
    dots[slideIndex].classList.remove('active');

    slideIndex += n;

    if (slideIndex >= slides.length) {
        slideIndex = 0;
    }
    if (slideIndex < 0) {
        slideIndex = slides.length - 1;
    }

    slides[slideIndex].classList.add('active');
    dots[slideIndex].classList.add('active');
}

function currentSlide(n) {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');

    slides[slideIndex].classList.remove('active');
    dots[slideIndex].classList.remove('active');

    slideIndex = n;

    slides[slideIndex].classList.add('active');
    dots[slideIndex].classList.add('active');
}

// Auto-play do carrossel
setInterval(() => {
    moveSlide(1);
}, 6000);

// Carrinho de Compras
let cart = [];

function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.getElementById('hamburger');

    // Fechar menu se estiver aberto
    navMenu.classList.remove('active');
    hamburger.classList.remove('active');

    cartSidebar.classList.toggle('active');
}

function toggleMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.getElementById('hamburger');
    const cartSidebar = document.getElementById('cart-sidebar');

    // Fechar carrinho se estiver aberto
    cartSidebar.classList.remove('active');

    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
}

function addToCart(productName, price, btnElement = null) {
    const existingProduct = cart.find(item => item.name === productName);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({
            name: productName,
            price: price,
            quantity: 1
        });
    }

    updateCart();

    // Feedback visual
    const btn = btnElement || (typeof event !== 'undefined' ? event.target : null);
    if (btn) {
        const originalText = btn.textContent;
        btn.textContent = 'Adicionado! ✓';
        btn.style.background = '#5fa030';

        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
        }, 1500);
    }
}

function removeFromCart(productName) {
    cart = cart.filter(item => item.name !== productName);
    updateCart();
}

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    const cartBtn = document.querySelector('.cart-btn');

    // Atualizar contador
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Adicionar ou remover classe de animação
    if (totalItems > 0) {
        cartBtn.classList.add('has-items');
    } else {
        cartBtn.classList.remove('has-items');
    }

    // Atualizar itens
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">Seu carrinho está vazio</p>';
        cartTotal.textContent = 'R$ 0,00';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>Quantidade: ${item.quantity}</p>
                <p class="cart-item-price">R$ ${(item.price * item.quantity).toFixed(2)}</p>
            </div>
            <button class="remove-item" onclick="removeFromCart('${item.name}')">Remover</button>
        </div>
    `).join('');

    // Atualizar total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `R$ ${total.toFixed(2)}`;
}

function finalizarCompra() {
    if (cart.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Formatar mensagem para WhatsApp
    let message = `🛒 *Pedido - Mix Artesanato*\n\n`;
    message += `Olá! Gostaria de fazer o seguinte pedido:\n\n`;
    
    cart.forEach(item => {
        const itemTotal = (item.price * item.quantity).toFixed(2);
        message += `• ${item.name}\n`;
        message += `  Quantidade: ${item.quantity}\n`;
        message += `  Valor: R$ ${itemTotal}\n\n`;
    });
    
    message += `*Total de itens:* ${totalItems}\n`;
    message += `*Valor total:* R$ ${total.toFixed(2)}\n\n`;
    message += `Aguardo confirmação! 😊`;

    // Codificar mensagem para URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = '5569992872548';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    // Abrir WhatsApp em nova aba
    window.open(whatsappUrl, '_blank');

    // Limpar carrinho
    cart = [];
    updateCart();
    toggleCart();
}

// Formulário de Contato
function enviarContato(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
    form.reset();
}

// Modal de Produto
let currentProduct = null;

function openProductModal(name, shortDesc, price, image, fullDesc) {
    const modal = document.getElementById('product-modal');
    const modalName = document.getElementById('modal-product-name');
    const modalShortDesc = document.getElementById('modal-product-short-desc');
    const modalFullDesc = document.getElementById('modal-product-full-desc');
    const modalPrice = document.getElementById('modal-product-price');
    const modalImage = document.getElementById('modal-product-image');

    currentProduct = { name, price };

    modalName.textContent = name;
    modalShortDesc.textContent = shortDesc;
    modalFullDesc.textContent = fullDesc;
    modalPrice.textContent = `R$ ${price.toFixed(2)}`;
    modalImage.src = image;
    modalImage.alt = name;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProductModal() {
    const modal = document.getElementById('product-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    currentProduct = null;
}

function addToCartFromModal() {
    if (currentProduct) {
        const btn = document.getElementById('modal-add-cart-btn');
        addToCart(currentProduct.name, currentProduct.price, btn);
        // Não fechar o modal imediatamente, deixar o feedback visual aparecer
        setTimeout(() => {
            closeProductModal();
        }, 1500);
    }
}

// Fechar modal ao pressionar ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeProductModal();
    }
});

// Scroll suave para links da navegação
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        // Fechar menu mobile ao clicar em um link
        const navMenu = document.querySelector('.nav-menu');
        const hamburger = document.getElementById('hamburger');
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');

        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});