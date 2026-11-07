export const FREE_SHIPPING_THRESHOLD_USD = 80;
export const SHIPPING_CHARGE_UNDER_THRESHOLD_USD = 15;

export const calculateShippingCharge = (subtotal: number): number => {
  const amount = Number(subtotal) || 0;
  return amount > 0 && amount < FREE_SHIPPING_THRESHOLD_USD
    ? SHIPPING_CHARGE_UNDER_THRESHOLD_USD
    : 0;
};
