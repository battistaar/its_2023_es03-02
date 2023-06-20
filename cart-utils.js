export function getVat(countryCode) {
    return countryCode === 'IT' ? 0.22 : 0;
}

export function getDiscountAmount(price, discount) {
    return price * discount / 100;
}

export function getDiscountedPrice(price, discount) {
    return price - getDiscountAmount(price, discount);
}

export function getVatAmount(price, vat) {
    return price * vat;
}

export function getFinalPrice(price, vat) {
    return price + getVatAmount(price, vat);
}

export function getTransportFee(weight) {
    let transportFee = 0;
    if (weight >= 2000) {
        transportFee = 7;
    }
    
    if (weight >= 5000) {
        transportFee = 15;
    }
    
    if (weight >= 10000) {
        transportFee = 20;
    }
    return transportFee;
}

export function calculateCartItem(item, vat) {
    let discountAmount = getDiscountAmount(item.netPrice, item.discount);
    let discountedPrice = getDiscountedPrice(item.netPrice, item.discount);
    discountedPrice *= item.quantity;
    let price = getFinalPrice(discountedPrice, vat);
    return {
        name: item.name,
        discountAmount: discountAmount,
        totalWeight: item.weight * item.quantity,
        price: price
    };
}

export function printCartItem(item) {
    let toPrint = `${item.name}: ${item.price}€`;
    if (item.discountAmount) {
        toPrint += ` (-${item.discountAmount}€)`;
    }
    console.log(toPrint);
}