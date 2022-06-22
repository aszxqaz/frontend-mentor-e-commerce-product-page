export const fromEntityProductToCartProduct = (product) => ({
   id: product.id,
   price: product.price,
   thumbnail: product.images[0].thumbnail,
   model: product.model
})
