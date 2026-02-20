export const selectCartItemsMap = (state) => state.cart.items;

export const selectCartItemsArray = (state) =>
  Object.values(state.cart.items);

export const selectCartTotalItems = (state) =>
  Object.values(state.cart.items).reduce((sum, item) => sum + item.qty, 0);

export const selectCartSubtotal = (state) =>
  Object.values(state.cart.items).reduce(
    (sum, item) => sum + item.qty * item.price,
    0
  );