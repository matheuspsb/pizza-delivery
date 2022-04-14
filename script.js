let cart = [];
let modalQt = 1;
let modalKey = 0;

const c = (el) => document.querySelector(el);
const cs = (el) => document.querySelectorAll(el);

//Listagem das Pizzas
pizzaJson.map((item, index) => {
    let pizzaItem = c('.models .pizza-item').cloneNode(true);
    
    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;                                 // adiciona a imagem 
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;        // adiciona o preço
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;                             // adiciona o nome
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;                      // adiciona a descrição
    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();                                                             // reseta a configuração da tag 'a'
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQt = 1;
        modalKey = key;

        c('.pizzaBig img').src = pizzaJson[key].img;                                    // adiciona a imagem no modal        
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;                             // adiciona o nome no modal
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;                   // adiciona a descrição no modal
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${item.price.toFixed(2)}`;         // item.price substitui o pizzaJson[key].price           
        c('.pizzaInfo--size.selected').classList.remove('selected');                    // remove quem ta selecionado
        cs('.pizzaInfo--size').forEach((size, sizeIndex) => {                           // percorre o size recebendo dois parametros
            if(sizeIndex == 2) {
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];     // adiciona o tamanho de cada pizza no modal

        });

        c('.pizzaInfo--qt').innerHTML = modalQt;

        c('.pizzaWindowArea').style.opacity = 0;                                        // tira a opacidade do modal
        c('.pizzaWindowArea').style.display = 'flex';                                   // adiciona o display 'flex' para ficar visivel
        setTimeout(() => {
            c('.pizzaWindowArea').style.opacity = 1;                                    // adiciona a opacidade no modal em 1/5 segundo
        },200);
    });

    c('.pizza-area').append(pizzaItem);                                                 // adiciona na tela as informações

});

// Eventos do MODAL
function closeModal() {
    c('.pizzaWindowArea').style.opacity = 0;                                            // tira a opacidade do modal
    setTimeout(() => {
        c('.pizzaWindowArea').style.display = 'none';                                   // adiciona o display none em 1/5 segundo
    }, 500);
}

cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => {      // percorre as duas classes
    item.addEventListener('click', closeModal);                                         // ao clicar chama a função CloseModal
});

c('.pizzaInfo--qtmenos').addEventListener('click', () => {                              // adicionou evento de click
    if(modalQt > 1) {                                                                   // so diminui se for maior que 1
        modalQt--;                                                                      // diminui a quantidade em 1
        c('.pizzaInfo--qt').innerHTML = modalQt;                                        // muda no html a quantidade
    }
});

c('.pizzaInfo--qtmais').addEventListener('click', () => {                               // adicionou evento de click
    modalQt++;                                                                          // aumenta a quantidade em 1
    c('.pizzaInfo--qt').innerHTML = modalQt;                                            // muda no html a quantidade
});

cs('.pizzaInfo--size').forEach((size, sizeIndex) => {                                   // percorre o size recebendo dois parametros
    size.addEventListener('click', (e) => {
        c('.pizzaInfo--size.selected').classList.remove('selected');                    // remove quem ta selecionado
        size.classList.add('selected');                                                 // adiciona a tag selected
    });

});

c('.pizzaInfo--addButton').addEventListener('click', () => {                            // Carrinho
    // Qual a pizza ?
    // Qual o tamanho ?
    // Quantas pizzas ? 
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));       // buscando a informação do tamanho
    let identifier = pizzaJson[modalKey].id+'@'+size;                                   // criando um identificador

    let key = cart.findIndex((item) => {                                                // procurando se tem algum item igual no cart
        return item.identifier == identifier;                                           // retorna o identifier ou -1
    });

    if(key > -1) {
        cart[key].qt += modalQt;                                                         // se achou so muda a quantidade
    } else {
        cart.push({                                                                      // preenchendo o array do carrinho
            identifier,                                                                  // preenchendo o identificador    
            id:pizzaJson[modalKey].id,                                                   // preenchendo qual é a pizza 
            size,                                                                        // preenchendo qual é o tamanho
            qt:modalQt                                                                   // preenchendo qual é a quantidade
        });
    }
    updateCart();                                                                        // atualiza o carrinho
    closeModal();                                                                        // fechando o modal
});

// Botão no Mobile para abrir o carrinho
c('.menu-openner').addEventListener('click', () => {
    if(cart.length > 0) {
        c('aside').style.left = '0';
    }
});

// Botão no Mobile para fechar o carrinho
c('menu-closer').addEventListener('click', () => {
    c('aside').style.left = '100vw';
});

function updateCart() {
    //Atualizando o botão no mobile
    c('.menu-openner span').innerHTML = cart.length;
    
    if(cart.length > 0) {                                                                // se existe algum item no carrinho
        c('aside').classList.add('show');                                                // abre a barra lateral do carrinho
        c('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;
        
        for(let i in cart) {
            let pizzaItem = pizzaJson.find((item) => {
                return item.id == cart[i].id;
            });
            subtotal += pizzaItem.price * cart[i].qt;                                   // calculando subtotal

            let cartItem = c('.models .cart--item').cloneNode(true);                    // clonando o cartItem
            
            let pizzaSizeName;                                                          // declarando a variavel
            // definindo os valores da variavel pizzaSizeName                                                          
            switch(cart[i].size) {                                                     
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'N';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;
            }
            // pizzaName recebe o nome da pizza e o tamanho dentro de uma concatenação 
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;                    
            // Preenchendo as informações no carrinho lateral
            cartItem.querySelector('img').src = pizzaItem.img;                         // adiciona a imagem no carrinho lateral
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;          // adiciona o nome e o tamanho no carrinho lateral
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;          // adiciona a quantidade no carrinho lateral
            // Adicionando a função de diminuir a quantidade no carrinho lateral
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if(cart[i].qt > 1) {
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1);
                }
                updateCart();
            });
            // Adicionando a função de aumentar a quantidade no carrinho lateral
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qt++;
                updateCart();
            });
            
            c('.cart').append(cartItem);
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
    } else {
        // Fecha no computador
        c('aside').classList.remove('show');
        // Fecha no Mobile
        c('aside').style.left = '100vw';
    }
}