import './menu.js'
// import './preview.js'
import { Cart } from './cart.js'
import { products } from './products.js'
import { fromEntityProductToCartProduct } from './adapters.js'
import { Preview } from './_preview.js'

const cart = new Cart({
	products: products.map(fromEntityProductToCartProduct),
})

const preview = new Preview('#preview', products[0].images, {
   itemSize: 88,
   gap: 20,
   totalSize: 445
})