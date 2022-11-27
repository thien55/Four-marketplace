import auth from './auth';
import user from './user';
import categories from './categories';
import order from './order';
import coupons from './coupons';
import merchants from './merchants';
import products from './products';
import favorites from './favorites';

export default [
  ...auth,
  ...user,
  ...categories,
  ...order,
  ...coupons,
  ...merchants,
  ...products,
  ...favorites,
];
