import { getDiscountAmount, getDiscountedPrice,
        getFinalPrice, getVat, getVatAmount, getTransportFee } from './cart-utils.js';
import { cart } from './cart.js';
import { Summary } from './summary.js';
import { createElement } from './utils.js';


function appendCartItem(item, vat, container, onQuantityChanged) {

    let template = `
        <li class="list-group-item item">
            <div class="d-flex flex-row d-flex justify-content-between align-items-center">
                <div class="item-name">
                    ${item.name}
                </div>
                
                <div class="d-flex flex-row align-items-center justify-content-end flex-wrap">
                    <span class="ms-2 d-flex flex-row align-items-center">
                        <label class="me-1" for="quantity">qty:</label>
                        <input class="form-control item-quantity" value="${item.quantity}" type="number" name="quantity" style="width: 70px">
                    </span>
                    <span class="ms-2">
                        <span class="item-price"></span>
                        <span class="item-discount"></span>
                    </span>
                </div>
            </div>
        </li>
    `;

    const element = createElement(template);
    updateCartItem(item, vat, element);

    const quantityEl = element.querySelector('.item-quantity');
    quantityEl.addEventListener('change', event => {
      const newQuantity = event.target.value;
      item.quantity = newQuantity;

      updateCartItem(item, vat, element);
      if (onQuantityChanged) {
        onQuantityChanged(item);
      }
    });

    container.appendChild(element);
}

function updateCartItem(item, vat,  element) {
  let updatedDiscountAmount = getDiscountAmount(item.netPrice, item.discount) * item.quantity;
  let updatedDiscountedPrice = getDiscountedPrice(item.netPrice, item.discount) * item.quantity;
  let updatedPrice = getFinalPrice(updatedDiscountedPrice, vat);

  element.querySelector('.item-price').innerHTML = `${updatedPrice.toFixed(2)}€`;
  element.querySelector('.item-discount').innerHTML = `(-${updatedDiscountAmount.toFixed(2)}€)`;
}

function updateSummary(items, vat) {
  let summary = items.reduce((summ, item) => {
    let discountedPrice = getDiscountedPrice(item.netPrice, item.discount) * item.quantity;
    const vatAmount = getVatAmount(discountedPrice, vat);
    const weight = item.weight * item.quantity;
    const price = getFinalPrice(discountedPrice, vat);

    return {
      netTotal: summ.netTotal + discountedPrice,
      totalVat: summ.totalVat +  vatAmount,
      totalWeight: summ.totalWeight + weight,
      totalPrice: summ.totalPrice + price
    };
  }, { netTotal: 0, totalVat: 0, totalWeight: 0, totalPrice: 0 });

  const transportFee = getTransportFee(summary.totalWeight);

  let template = `
    <div>
      <div class="d-flex justify-content-between">
        <span>Net Total:</span>
        <span>${summary.netTotal}€</span>
      </div>
      
      <div class="d-flex justify-content-between">
        <span>VAT:</span>
        <span>${summary.totalVat}€</span>
      </div>
      <div class="d-flex justify-content-between">
        <span>Transport:</span>
        <span >${transportFee}€</span>
      </div>
      <hr>
      <div class="d-flex justify-content-between">
        <span>Total:</span>
        <span>${summary.totalPrice}€</span>
      </div>
    </div>
  `;
  return createElement(template);
}

const vat = getVat('IT');
const container = document.querySelector('#items-list');
const summaryContainer = document.querySelector('.order-summary');
let summary = new Summary(cart, vat);

cart.forEach(item => {
    appendCartItem(item, vat, container, () => {
      summary.items = cart;
    });
});

summaryContainer.appendChild(summary.element);