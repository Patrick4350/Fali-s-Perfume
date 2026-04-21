export const Events = {
  // Product
  PRODUCT_VIEWED: 'product_viewed',
  ADD_TO_CART: 'add_to_cart',
  REMOVE_FROM_CART: 'remove_from_cart',
  ADD_TO_WISHLIST: 'add_to_wishlist',
  VARIANT_SELECTED: 'variant_selected',

  // Cart & Checkout
  CART_OPENED: 'cart_opened',
  CHECKOUT_STARTED: 'checkout_started',
  ORDER_COMPLETED: 'order_completed',

  // Navigation
  HERO_CTA_CLICKED: 'hero_cta_clicked',
  CATEGORY_CLICKED: 'category_clicked',
  SEARCH_PERFORMED: 'search_performed',
  NAV_LINK_CLICKED: 'nav_link_clicked',

  // Auth
  SIGN_UP: 'sign_up',
  SIGN_IN: 'sign_in',
  SIGN_OUT: 'sign_out',
} as const
