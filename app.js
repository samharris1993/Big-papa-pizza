
const menu = [
  {id:1,name:"Margarita",price:9.95,image:"margarita.jpg",desc:"San Marzano tomato sauce and mozzarella."},
  {id:2,name:"Pepperoni",price:10.95,image:"pepperoni.jpg",desc:"San Marzano tomato sauce, mozzarella and pepperoni."},
  {id:3,name:"Pepperoni Crumble",price:10.95,image:"pepperoni-crumble.jpg",desc:"San Marzano tomato sauce, mozzarella and crumbled pepperoni."},
  {id:4,name:"Pepper-Honey",price:11.95,image:"pepper-honey.jpg",desc:"Pepperoni with a drizzle of hot honey."},
  {id:5,name:"Hot Honey",price:10.95,image:"hot-honey.jpg",desc:"San Marzano tomato sauce, mozzarella and a drizzle of hot honey."},
  {id:6,name:"Big Papas Fully Loaded",price:13.95,image:"fully-loaded.jpg",desc:"Pepperoni, pepperoni crumble, jalapeños and a drizzle of hot honey."}
];

let cart = [];
let orderType = "Collection";

const money = v => `£${v.toFixed(2)}`;
const menuGrid = document.getElementById("menuGrid");

function renderMenu(){
  menuGrid.innerHTML = menu.map(p => `
    <article class="pizza-card">
      <div class="pizza-photo"><img src="${p.image}" alt="${p.name} pizza"></div>
      <div class="pizza-body">
        <h3 class="pizza-title">${p.name}</h3>
        <p class="pizza-desc">${p.desc}</p>
        <div class="price-row">
          <span class="price">${money(p.price)}</span>
          <button class="add" onclick="addToCart(${p.id})">Add to order</button>
        </div>
      </div>
    </article>
  `).join("");
}

function addToCart(id){
  const found = cart.find(x => x.id === id);
  if(found) found.qty++;
  else cart.push({...menu.find(p => p.id === id), qty:1});
  renderCart();
}

function changeQty(id, delta){
  const item = cart.find(x => x.id === id);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0) cart = cart.filter(x => x.id !== id);
  renderCart();
}

function total(){
  return cart.reduce((sum,i) => sum + i.price*i.qty, 0);
}

function renderCart(){
  document.getElementById("cartCount").textContent = cart.reduce((s,i)=>s+i.qty,0);
  document.getElementById("subtotal").textContent = money(total());
  document.getElementById("cartTotal").textContent = money(total());
  document.getElementById("checkoutTotal").textContent = money(total());
  document.getElementById("cartOrderType").textContent = orderType;
  const wrap = document.getElementById("cartItems");
  if(!cart.length){
    wrap.innerHTML = `<div class="empty">Your cart is empty.<br>Add a pizza to get started.</div>`;
    return;
  }
  wrap.innerHTML = cart.map(i => `
    <div class="cart-item">
      <div>
        <h3>${i.name}</h3>
        <span class="muted">${money(i.price)} each</span>
        <div class="qty">
          <button onclick="changeQty(${i.id},-1)">−</button>
          <strong>${i.qty}</strong>
          <button onclick="changeQty(${i.id},1)">+</button>
        </div>
      </div>
      <strong>${money(i.price*i.qty)}</strong>
    </div>
  `).join("");
}

function openCart(){
  document.getElementById("cartDrawer").classList.add("open");
  document.getElementById("cartDrawer").setAttribute("aria-hidden","false");
  document.getElementById("drawerBackdrop").classList.remove("hidden");
}
function closeCart(){
  document.getElementById("cartDrawer").classList.remove("open");
  document.getElementById("cartDrawer").setAttribute("aria-hidden","true");
  document.getElementById("drawerBackdrop").classList.add("hidden");
}

document.getElementById("openCart").addEventListener("click",openCart);
document.getElementById("closeCart").addEventListener("click",closeCart);
document.getElementById("drawerBackdrop").addEventListener("click",closeCart);
document.getElementById("goCheckout").addEventListener("click",()=>{
  closeCart();
  document.querySelector(".checkout").scrollIntoView({behavior:"smooth"});
});

document.querySelectorAll(".seg").forEach(btn=>{
  btn.addEventListener("click",()=>{
    document.querySelectorAll(".seg").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    orderType = btn.dataset.type;
    document.getElementById("orderTypeNote").textContent = `${orderType} selected.`;
    document.getElementById("deliveryFields").classList.toggle("hidden", orderType !== "Delivery");
    document.getElementById("address").required = orderType === "Delivery";
    renderCart();
  });
});

document.getElementById("checkoutForm").addEventListener("submit", async e=>{
  e.preventDefault();

  if(!cart.length){
    openCart();
    return;
  }

  const submitButton = e.target.querySelector('button[type="submit"]');
  const oldText = submitButton.textContent;
  submitButton.disabled = true;
  submitButton.textContent = "Sending order...";

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const email = document.getElementById("email").value.trim();
  const requestedTime = document.getElementById("time").value;
  const address = document.getElementById("address").value.trim();
  const notes = document.getElementById("notes").value.trim();
  const ref = `BP${Date.now().toString().slice(-6)}`;

  const itemSummary = cart
    .map(i => `${i.qty} × ${i.name} @ ${money(i.price)} = ${money(i.price*i.qty)}`)
    .join("
");

  const payload = new URLSearchParams({
    "form-name": "pizza-orders",
    "order_reference": ref,
    "customer_name": name,
    "phone": phone,
    "email": email,
    "order_type": orderType,
    "requested_time": requestedTime,
    "address": orderType === "Delivery" ? address : "Collection",
    "notes": notes || "None",
    "order_items": itemSummary,
    "order_total": money(total())
  });

  try {
    const response = await fetch("/", {
      method: "POST",
      headers: {"Content-Type": "application/x-www-form-urlencoded"},
      body: payload.toString()
    });

    if(!response.ok) throw new Error("Order submission failed");

    document.getElementById("confirmationText").innerHTML =
      `Thanks <strong>${name}</strong>. Your ${orderType.toLowerCase()} order has been sent.<br><br>` +
      `Order reference: <strong>${ref}</strong><br>` +
      `${cart.map(i=>`${i.qty}× ${i.name}`).join(", ")}<br>` +
      `<strong>Total: ${money(total())}</strong>`;

    document.getElementById("confirmation").showModal();
    cart = [];
    renderCart();
    e.target.reset();
    orderType = "Collection";
    document.querySelectorAll(".seg").forEach(b=>b.classList.toggle("active", b.dataset.type==="Collection"));
    document.getElementById("deliveryFields").classList.add("hidden");
    document.getElementById("orderTypeNote").textContent = "Collection selected.";
  } catch(err) {
    alert("Sorry, we couldn't send your order. Please try again.");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = oldText;
  }
});

document.getElementById("closeConfirmation").addEventListener("click",()=>document.getElementById("confirmation").close());

renderMenu();
renderCart();

if("serviceWorker" in navigator){
  window.addEventListener("load",()=>navigator.serviceWorker.register("service-worker.js").catch(()=>{}));
}
