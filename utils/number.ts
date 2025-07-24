import { Float } from "react-native/Libraries/Types/CodegenTypes";

export function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

export function formatPriceForInput(price:string|number) {
    if (typeof price == "string") price = parseInt(price);
    const priceEuro = price/100;
    return String(Number.isInteger(priceEuro) ? (priceEuro).toString() : priceEuro.toFixed(2)).replace('.',',')
}

export function formatPriceForLabel(price:string) {
    let priceSplit = price.split(/[.,]/)
    if (priceSplit[1]) priceSplit[1] = priceSplit[1].padEnd(2, '0')

    return priceSplit.join(',')
}