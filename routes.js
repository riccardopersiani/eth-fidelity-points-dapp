// File for defining different routes.
// Refer to gitub.com/fridays/next-routes.
// () means that a function is invoked after the require.
const routes = require('next-routes')();

// New route mapping with add(), pattern that we look for and that the file
routes
  .add(`/index`, '/index')
  .add(`/stats`, '/stats')
  .add(`/shop`, '/shop')
  .add(`/createTokens`, '/createTokens')
  .add(`/newShop`, '/newShop')
  .add(`/shops/0xE82d7CD3186212819D152b6d27ac88762B147F55`, '/shops/0xE82d7CD3186212819D152b6d27ac88762B147F55')
  .add(`/shops/0x36C6BbF42E54a693320E725D46E4363Be6A9e338`, '/shops/0x36C6BbF42E54a693320E725D46E4363Be6A9e338')
  .add(`/auth/signIn`, '/auth/signIn')
  .add(`/auth/signUpUser`, '/auth/signUpUser')
  .add(`/auth/signUpShop`, '/auth/signUpShop')
  .add(`/auth/profile`, '/auth/profile')
  .add(`/psd2/connect`, '/psd2/connect')
  .add(`/askPayment`, '/askPayment')
  .add(`/shopRequestStatus`, '/shopRequestStatus')
  .add(`/shopShipOrder`, '/shopShipOrder')
  .add(`/adminShipOrder`, '/adminShipOrder')
  .add(`/userOrderStatus`, '/userOrderStatus')
  .add(`/approve/approveShop`, '/approve/approveShop')
  .add(`/approve/approvePayment`, '/approve/approvePayment');

module.exports = routes;
