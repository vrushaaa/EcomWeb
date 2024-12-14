let allProducts;
let cart = []; // <= added code

document.addEventListener("DOMContentLoaded", initialise);


function initialise() {
    fetchProducts();
    filterCategories();
    searchProduct();
    openCart();
  }

async function fetchProducts() {
    try {
      // fetch products from fake store api
      const resp = await fetch("https://fakestoreapi.com/products");
      const data = await resp.json();
      // allProducts variable saved as data response
      allProducts = data;
    //   console.log(allProducts);
      displayProducts(allProducts); 
    } catch (error) {
      console.error(error);
    }
  }

  // displayProducts iterates through allProducts variable
function displayProducts(products) {
    // select element to put the list inside of
    const list = document.querySelector("#list");
    products
      .map((product) => {
        const { image, category, price, title, id } = product;
        // add each item inside the list ul
        list.innerHTML += `
       <li class="card">
        <div class="img-content">
         <img src=${image} alt=${category} />
        </div>
        <div class="card-content">
         <p class="card-price">$${price.toFixed(2)}</p>
         <h4 class="card-title">${title.substring(0, 45)}...</h4>
         <p class="card-desc hide">
        ${category.toUpperCase()}
        </p> 
        <div class="btn-container">
         <button class="card-btn" onclick="addToCart(${id})">Add to Cart</button>
        </div>
       </li>
       
      `;
    })
    .join("");
  }

  function filterCategories() {
    // 1 - select the select element
    const select = document.querySelector("#filter-btn");
    // 2 - add onchange event listener
    select.addEventListener("change", filterProducts);
  
    // 3 - create filter function
    function filterProducts(e) {
      // select element to put filtered list inside of
      let list = document.querySelector("#list");
      // create variable that will be the filtered html depending on value
      let content;
      // create variable to use for switch case - need to know the select value
      let option = e.target.value;
  
      // clear existing list
      list.innerHTML = "";
  
      // if option equal to one of the cases, content is equal to the filtered option
      switch (option) {
        case "all":
          content = allProducts;
          break;
        case "men":
          content = allProducts.filter((product) => {
            return product.category === "men's clothing";
          });
          break;
        case "women":
          content = allProducts.filter((product) => {
            return product.category === "women's clothing";
          });
          break;
        case "jewellery":
          content = allProducts.filter((product) => {
            return product.category === "jewelery";
          });
          break;
        case "electronics":
          content = allProducts.filter((product) => {
            return product.category === "electronics";
          });
          break;
        default:
          content = allProducts;
      }
      // content then iterated over and displayed inside list
      content
        .map((product) => {
          const { image, category, price, title, id } = product;
          list.innerHTML += `
      <li class="card">
      
      <div class="img-content">
      <img src=${image} alt=${category} />
      </div>
      <div class="card-content">
      <p class="card-price">$${price}</p>
      <h4 class="card-title">${title.substring(0, 45)}...</h4>
      <p class="card-desc hide">
      ${category.toUpperCase()}
      </p> 
      <div class="btn-container">
      <button class="card-btn" onclick="addToCart(${id})">Add to Cart</button>
      </div>
      </li>
      
     `;
        })
        .join("");
    }
  }

  function searchProduct() {
    // 1. Select element
    const searchInput = document.querySelector("#search-input");
    const list = document.querySelector("#list");
    // 2. add event listener
    searchInput.addEventListener("keyup", (e) => {
      list.innerHTML = "";
      // 3. get value from input
      let searchTerm = e.target.value.toLowerCase();
      // 4. filter products array and return filtered products
      let content = allProducts.filter((product) => {
        return product.title.toLowerCase().includes(searchTerm);
      });
      content
        .map((product) => {
          const { image, price, category, title, id } = product;
          list.innerHTML += `
      <li class="card">
      
      <div class="img-content">
      <img src=${image} alt=${category} />
      </div>
      <div class="card-content">
      <p class="card-price">$${price.toFixed(2)}</p>
      <h4 class="card-title">${title.substring(0, 45)}...</h4>
      <p class="card-desc hide">
      ${category.toUpperCase()}
      </p> 
      <div class="btn-container">
      <button class="card-btn" onclick="addToCart(${id})">Add to Cart</button>
      </div>
      </li>
      
     `;
        })
        .join("");
    });
  }

  function openCart() {
    const cartBtn = document.querySelector(".cart-container");
    // on click, open modal
    cartBtn.addEventListener("click", seeModal);
  }
  
  // see modal function
  function seeModal() {
    const body = document.body;
    const cartModal = document.querySelector(".modal");
    cartModal.classList.remove("hide");
    body.classList.add("modal-open");
  }

  function closeCart() {
    const closeBtn = document.querySelector(".fa-xmark");
    closeBtn.addEventListener("click", closeModal);
  }
  
  function closeModal() {
    const body = document.body;
    const cartModal = document.querySelector(".modal");
    cartModal.classList.add("hide");
    body.classList.remove("modal-open");
  }

  // function adds product to cart
function addToCart(id) {
    // find it product is in cart
    const searchCart = cart.find((product) => product.id === id);
    // disallows duplicate items to be put in cart
    if (searchCart) {
      alert("Product already added to the cart");
    } else {
      // if no product with same id in cart, add to cart
      const oldProduct = allProducts.find((product) => product.id === id);
      // push product to cart, along with quantity of 1, to increase/decrease number later in cart
      cart.push({ ...oldProduct, quantity: 1 });
    }
    console.log(cart);
  
    
  }
  
  function shoppingCart() {
    const cartList = document.querySelector("#cart-list");
    const cartTotal = document.querySelector("#cart-total");
    const cartNumber = document.querySelector(".cart-number-container");
    let cartHTML = "";
  
    // map through cart, display cart contents
    cart
      .map((product) => {
        const { title, price, quantity, id } = product;
        cartHTML += `
     <li id="item-container">
      <div class="cart-title">
        <h3>${title.substring(0, 30)}...</h3>
      </div>
      <div class="cart-quantity-container">
       <p class="cart-price">$${price.toFixed(2)}</p>
       <div class="button-quantity-container">
        <button class="plus" onclick="increment(${id}, event)">+</button>
        <p>${quantity}</p>
        <button class="minus" onclick="decrement(${id}, event)">-</button>
        </div>
        <p id="item-total">$${(price * quantity).toFixed(2)}</p>
       <div class="remove-cart-item">
         <button onclick="deleteCartItem(${id}, event)">X</button>
       </div>
      </div>
     </li>
    `;
      })
      .join("");
    cartList.innerHTML = cartHTML;
  
    // select the total amount (quantity * price) of each item
    const itemTotals = document.querySelectorAll("#item-total");
    let sum = 0;
    // iterate over all the items total price
    itemTotals.forEach((itemTotal) => {
      const numericValue = itemTotal.innerHTML;
      // find where the price starts and cut the rest
      const index = numericValue.indexOf("$");
      // turn into a number value
      sum += Number(numericValue.slice(index + 1));
    });
    // display depending on if the cart is empty or not
    cartTotal.innerHTML =
      sum > 0
        ? `<button id="checkout" onclick="checkout()">Pay Now: $${sum.toFixed(
            2
          )}</button>`
        : `No items in the cart`;
  
    let newSum = 0;
    cart.map((product) => {
      newSum += product.quantity;
    });
  
    if (newSum < 1) {
      cartNumber.classList.add("hide");
    } else {
      cartNumber.classList.remove("hide");
      cartNumber.innerHTML = newSum;
    }
  }


  // function adds product to cart
  function addToCart(id) {
    // find it product is in cart
    const searchCart = cart.find((product) => product.id === id);
    // disallows duplicate items to be put in cart
    if (searchCart) {
      alert("Product already added to the cart");
    } else {
      // if no product with same id in cart, add to cart
      const oldProduct = allProducts.find((product) => product.id === id);
      // push product to cart, along with quantity of 1, to increase/decrease number later in cart
      cart.push({ ...oldProduct, quantity: 1 });
    }
    console.log(cart);
    // update shopping cart to show new product
    shoppingCart(); // <= called function
  }

  function increment(id) {
    const cartProduct = cart.find((product) => product.id === id);
    // increase product quantity
    if (cartProduct) {
      cartProduct.quantity++;
    }
    // update cart after product quantity increment
    shoppingCart();
  }
  // function to minus quantity from the product in the cart
  function decrement(id) {
    const cartProduct = cart.find((product) => product.id === id);
    // if quantity number higher than 1, decrement quantity
    if (cartProduct && cartProduct.quantity > 1) {
      cartProduct.quantity--;
    }
    // update cart
    shoppingCart();
  }

  function deleteCartItem(id) {
    cart = cart.filter((product) => product.id !== id);
  
    // update cart
    shoppingCart();
  }

  // function to leave purchase message and empty cart contents
function checkout() {
    // const checkoutBtn = document.querySelector("#checkout");
    const cartList = document.querySelector("#cart-list");
    cart = [];
    shoppingCart();
    cartList.innerHTML = `<p class="checkout-message">Thank you for your purchase</p>`;
  }