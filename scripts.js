const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItensContainer = document.getElementById("cart-itens")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")
const paymentMethodInput = document.getElementById("payment-method")
const paymentWarn = document.getElementById("payment-warn")
const nomeCliente = document.getElementById("customer-name-client")

let cart = [];


// abrir o modal do carrinho 
cartBtn.addEventListener("click", function () {
    updateCartModal();
    cartModal.style.display = "flex"

})

// Fechar o modal do carrinho 
cartModal.addEventListener("click", function (event) {
    if (event.target === cartModal) {
        cartModal.style.display = "none"
    }
})

closeModalBtn.addEventListener("click", function () {
    cartModal.style.display = "none"
})

menu.addEventListener("click", function (event) {
    let parentButton = event.target.closest(".add-to-cart-btn")

    if (parentButton) {
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))

        addToCart(name, price)
    }
})


// função para adicionar ao carrinho 
function addToCart(name, price) {

    const existItem = cart.find(item => item.name === name)
    if (existItem) {
        //se o item ja existe adiciona mais um item apenas na qunatidade
        existItem.quantity += 1;

    } else {
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }

    Toastify({
        text: "Produto adicionado ao carrinho!",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: "#16a34a",
            borderRadius: "20px",
            color: "#fff"
        },
    }).showToast();

    updateCartModal()

}

function updateCartModal() {
    cartItensContainer.innerHTML = ""
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "flex-col", "mb-6");
        cartItemElement.innerHTML = `
        
        <div class="flex items-center justify-between">
            <div>
                <p class="font-medium">${item.name}</p>
                <p>Quant. ${item.quantity}</p>
                <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
            </div>


            <button class="remove-from-cart-btn text-red-500" data-name="${item.name}">
                Remover
            </button> 
        </div>


        `

        total += item.price * item.quantity;

        cartItensContainer.appendChild(cartItemElement)

    })

    cartTotal.textContent = total.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });

    cartCounter.innerHTML = cart.length;
}


//Função para remover item do carrinho

cartItensContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-from-cart-btn")) {
        const name = event.target.getAttribute("data-name");
        removeItemCart(name);
    }
})

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);

    if (index !== -1) {
        const item = cart[index];
        if (item.quantity > 1) {
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }
}

addressInput.addEventListener("input", function (event) {
    let inputValue = event.target.value;
    if (inputValue !== "") {
        addressWarn.classList.add("hidden");
        addressInput.classList.remove("border-red-500");
    }
});

paymentMethodInput.addEventListener("input", function (event) {
    let inputValue = event.target.value;
    if (inputValue !== "") {
        paymentWarn.classList.add("hidden");
        paymentMethodInput.classList.remove("border-red-500");

    }
});


// Finalizar pedido
checkoutBtn.addEventListener("click", function () {


    const isOpen = checkRestauranteOpen();
    if (!isOpen) {
        Toastify({
            text: "Ops! O restaurante está fechado no momento. Horário de funcionamento: das 11:00 às 16:00 de Segunda a Sábado.",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#dc2626",
            },
        }).showToast();
        return;
    };

    if (cart.length === 0) return;
    if (addressInput.value === "") {
        addressWarn.classList.remove("hidden");
        addressInput.classList.add("border-red-500");
        return;
    }
    if (paymentMethodInput.value === "") {
        paymentWarn.classList.remove("hidden");
        paymentMethodInput.classList.add("border-red-500");
        return;
    }

    // enviar o pedido para o whatsapp

    const cartItems = cart.map(item => {
        return (
            ` ${item.quantity} - ${item.name} R$ ${item.price.toFixed(2)}\n`
        )
    }).join("");

    const message = encodeURIComponent(cartItems)
    const phone = "5511939591754"
    const formaDePagamento = paymentMethodInput.value;
    const identificacaoCliente = nomeCliente.value;
    let totalCompra = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    totalCompra = totalCompra.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    window.open(`https://wa.me/${phone}?text=Olá, estou vindo do seu Cardápio online, me chamo ${identificacaoCliente} %0A%0AGostaria de fazer o pedido de: %0A%0A${message} %0AValor total: R$ ${totalCompra} %0A%0AForma de pagamento: ${formaDePagamento} %0A%0AEndereço de entrega: ${addressInput.value}`, "_blank");
    cart = [];
    updateCartModal();
});


function checkRestauranteOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 12 && hora < 16;
    // se retornar True o restaurante está aberto
}


const spanItem = document.getElementById("date-span")
const isOpen = checkRestauranteOpen();

if (isOpen) {
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
} else {
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500");
}