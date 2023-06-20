import { createElement } from "./utils.js";
import { getDiscountedPrice, getVatAmount, getFinalPrice, getTransportFee } from "./cart-utils.js";

export class Summary {
  #items = [];
  #vat = 0;
  #element;
  get element() {
    return this.#element;
  }

  get items() {
    return this.#items;
  }
  set items(value) {
    this.#items = !!value ? value : [];
    this.#update(this.#items, this.#vat);
  }

  get vat() {
    return this.#vat;
  }
  set vat(value) {
    this.#vat = value !== undefined ? value : 0;
    this.#update(this.#items, this.#vat);
  }

  constructor(items, vat) {
    this.#element = this.#createElement();
    if (items) {
      this.#items = items;
    }
    if (vat !== undefined) {
      this.#vat = vat;
    }
    this.#update(this.#items, this.#vat);
  }

  #createElement() {
    let template = `
      <div>
        <div class="d-flex justify-content-between">
          <span>Net Total:</span>
          <span class="summary-net"></span>
        </div>
        
        <div class="d-flex justify-content-between">
          <span>VAT:</span>
          <span class="summary-vat"></span>
        </div>
        <div class="d-flex justify-content-between">
          <span>Transport:</span>
          <span class="summary-transport"></span>
        </div>
        <hr>
        <div class="d-flex justify-content-between">
          <span>Total:</span>
          <span class="summary-total"></span>
        </div>
      </div>
    `;
    return createElement(template);
  }

  #update(items, vat) {
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

    this.#element.querySelector('.summary-net').innerHTML = `${summary.netTotal}€`;
    this.#element.querySelector('.summary-vat').innerHTML = `${summary.totalVat}€`;
    this.#element.querySelector('.summary-transport').innerHTML = `${transportFee}€`;
    this.#element.querySelector('.summary-total').innerHTML = `${summary.totalPrice}€`;
  }

}