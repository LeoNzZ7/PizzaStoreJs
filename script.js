let cart = [];
let modalQt = 1;
let modalkey = 0;
const qs = (q)=>{
    return document.querySelector(q);
}
const qsa = (qa)=>{
    return document.querySelectorAll(qa);
}

pizzaJson.map((item, index)=>{
    let pizzaItem = qs(".models .pizza-item").cloneNode(true);

    pizzaItem.setAttribute('data-key', index);

    //Adiciona as informações da pizza no site.
    pizzaItem.querySelector(".pizza-item--img img").src = item.img;
    pizzaItem.querySelector(".pizza-item--price").innerHTML = `R$ ${item.price[0].toFixed(2)}`;
    pizzaItem.querySelector(".pizza-item--name").innerHTML = item.name;
    pizzaItem.querySelector(".pizza-item--desc").innerHTML = item.description;

    //Abre o modal de escolha de pizza e adiciona informações das pizzas ao modal.
    pizzaItem.querySelector("a").addEventListener('click', (e)=>{
        e.preventDefault()
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQt = 1;
        modalkey = key; 

        //informações das pizzas dentro do modal.
        qs('.pizzaBig img').src = pizzaJson[key].img;
        qs('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        qs('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        qs('.pizzaInfo--size.selected').classList.remove('selected')
        qsa('.pizzaInfo--size').forEach((size, sizeIndex)=>{
            if(sizeIndex === 2){
                size.classList.add('selected');
                qs('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price[2].toFixed(2)}`;
            };
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];

            size.addEventListener('click', (e)=>{
                qs('.pizzaInfo--size.selected').classList.remove('selected')
                size.classList.add('selected')
        
                qs('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price[sizeIndex].toFixed(2)}`;
            })
        });

        qs('.pizzaInfo--qt').innerHTML = modalQt;
       
        //Abre e fecha o modal.
        qs('.pizzaWindowArea').style.opacity = '0';
        qs('.pizzaWindowArea').style.display = 'flex';
        setTimeout(()=>{
            qs('.pizzaWindowArea').style.opacity = '1';
        }, 200)
    })

    qs('.pizza-area').append( pizzaItem );
});

//função que sera responsavel por fechar o modal.
function closeModal() {
    qs('.pizzaWindowArea').style.opacity = '0';
    setTimeout(()=>{
        qs('.pizzaWindowArea').style.display = 'none';
    }, 500);
}
//Função que sera responsavel por aumentar e diminuir a quantidade de pizzas.
qsa('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal)
});
qs('.pizzaInfo--qtmenos').addEventListener('click', ()=>{  
    if (modalQt > 1) {
        modalQt--;
    }
    qs('.pizzaInfo--qt').innerHTML = modalQt;
});
qs('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    modalQt++;
    qs('.pizzaInfo--qt').innerHTML = modalQt;
});

// filtra as informações das pizzas antes de adionar ao carrinho para que não haja duplicação de informações, mas sim que as somem caso duplicadas
qs('.pizzaInfo--addButton').addEventListener('click', ()=>{
    let size = qs('.pizzaInfo--size.selected').getAttribute('data-key')
    
    let indentifier = pizzaJson[modalkey].id+'@'+size;
    let key = cart.findIndex((item) => item.indentifier == indentifier);
    if (key > -1) {
        cart[key].qt += modalQt;
    } else {
        cart.push({
            indentifier,
            id:pizzaJson[modalkey].id,
            size,
            qt:modalQt
        });
    }

    updateCart();
    closeModal();
});

qs('.menu-openner').addEventListener('click', () => {
    if (cart.length > 0) {
        qs('aside').style.left = 0;
    }
})
qs('.menu-closer').addEventListener('click', ()=>{
    qs('aside').style.left = '100vw';
})

//Funcão de atualizar o carrinho de compras.
function updateCart() {
    qs('.menu-openner span').innerHTML = cart.length;


    if(cart.length > 0) {
        qs('aside').classList.add('show')
        qs('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart) { //Loop que mapeia as informações da pizza para adicionar no carrinho
            let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id)

            let PizzaValue = 0;

            if(parseInt(cart[i].size) == 0) {
                PizzaValue = pizzaItem.price[0];
            } else if (parseInt(cart[i].size) == 1) {
                PizzaValue = pizzaItem.price[1];
            } else {
                PizzaValue = pizzaItem.price[2];
            }

            subtotal += PizzaValue * cart[i].qt;

            console.log(pizzaItem.price[i])

            let cartItem = qs('.models .cart--item').cloneNode(true)
            let pizzaSizeName; 
            switch(parseInt(cart[i].size)) {
                case 0:
                    pizzaSizeName = 'P'
                    break; 
                case 1:
                    pizzaSizeName = 'M'
                    break; 
                case 2:
                    pizzaSizeName = 'G' 
                    break; 
            }
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                if(cart[i].qt > 1) {
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1);
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].qt++;
                updateCart();
            });

            qs('.cart').append(cartItem)
        }        

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        qs('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        qs('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        qs('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;


    } else {
        qs('aside').classList.remove('show')
        qs('aside').style.left = '100vw';
    }
}