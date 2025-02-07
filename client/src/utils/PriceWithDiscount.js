export const PriceWithDiscount = (price, discount=1) => { //discount not provide or 0 by default its 1
   const discountAmount = Math.ceil((Number(price) * Number(discount)) / 100)
   const actualPrice = Number(price) - Number(discountAmount)
   return actualPrice
}
