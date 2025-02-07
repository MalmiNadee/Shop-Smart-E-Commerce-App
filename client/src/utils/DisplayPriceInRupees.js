export const DisplayPriceInRupees = (price) => {
    return new Intl.NumberFormat('en-IN', {
        style: "currency",
        currency: "LKR", // currency code for Sri Lankan Rupees.
    }).format(price);
};
