const CART_WRAPPER_SELECTOR = '.my_cart_wrapper'
const CART_TOGGLE_BUTTON_SELECTOR = '.my_cart_toggle'
const QUANTITY_DISPLAY_DATASET_ATTRIBUTE = 'my_cart_quantity'
const ADD_BUTTON_DATASET_ATTRIBUTE = 'my_cart_add'
const REMOVE_BUTTON_DATASET_ATTRIBUTE = 'my_cart_remove'
const ADD_TO_CART_BUTTON_SELECTOR = '.my_cart_add_to_cart'
const CART_BADGE_SELECTOR = '.my_cart_badge'

export class Cart {
	constructor(options) {
		this.itemsAdded = []
		this.itemsSelected = []
		this._products = [...options.products]
		this._uniqueField = options.uniqueField || 'id'

		this.initializeButtons()
		this.badge = document.querySelector(CART_BADGE_SELECTOR)

		this._$cart = this.createCart()
		const cartWrapper = document.querySelector(CART_WRAPPER_SELECTOR)
		cartWrapper.append(this._$cart)

		this.updateCart()
	}

	updateBadge() {
		this.badge.innerText = this.itemsAdded.reduce((acc, el) => acc + el.quantity, 0) || ''
	}

	initializeButtons() {
		const addButtons = document.querySelectorAll(`[data-${ADD_BUTTON_DATASET_ATTRIBUTE}]`)
		addButtons.forEach((addBtn) => {
			addBtn.addEventListener('click', () => {
				const productId = addBtn.dataset[ADD_BUTTON_DATASET_ATTRIBUTE]
				this.select(productId)
			})
		})

		const removeButtons = document.querySelectorAll(`[data-${REMOVE_BUTTON_DATASET_ATTRIBUTE}]`)
		removeButtons.forEach((removeBtn) => {
			removeBtn.addEventListener('click', () => {
				const product_id = removeBtn.dataset[REMOVE_BUTTON_DATASET_ATTRIBUTE]
				this.remove(product_id)
			})
		})

		const addToCartButton = document.querySelector(ADD_TO_CART_BUTTON_SELECTOR)
		addToCartButton.addEventListener('click', () => {
			this.addToCart()
		})

		const cartToggleBtns = document.querySelectorAll(CART_TOGGLE_BUTTON_SELECTOR)

		cartToggleBtns.forEach((btn) => {
			btn.addEventListener('click', (e) => {
				e.stopPropagation()
				this.show()
				const onClose = (e) => {
					if (e.target.closest('.cart') || e.target.closest('.cart-item__delete')) return
					this.hide()
					document.removeEventListener('click', onClose)
				}
				document.addEventListener('click', onClose)
			})
		})
	}

	addToCart() {
		this.itemsAdded = [...this.itemsSelected]
		this.updateCart()
		this.updateBadge()
	}

	delete(index) {
		this.itemsAdded.splice(index, 1)
      console.log('deleting')
		this.updateCart()
		this.updateBadge()
	}

	createCart() {
		const cart = document.createElement('div')
		cart.classList.add('cart')
		const cart_title = document.createElement('h3')
		cart_title.innerText = 'Cart'
		cart.appendChild(cart_title)
		return cart
	}

	getCartItem(product, quantity) {
		const cart_item = document.createElement('div')
		cart_item.classList.add('cart__item', 'cart-item')
		const amount = product.price * quantity
		cart_item.insertAdjacentHTML(
			'afterbegin',
			`
         <div class="cart-item__img">
            <img src="${product.thumbnail}" />
         </div>
         <div class="cart-item__description">
            <p>${product.model}</p>
            <p>$${product.price.toFixed(2)} x ${quantity} <span class="cart-item__amount">$${amount.toFixed(
				2,
			)}</span></p>
         </div>
         <div class="cart-item__delete">
            <img src="/images/icon-delete.svg" />
         </div>
      `,
		)
		return cart_item
	}

	updateCart() {
		const cartItems = this._$cart.querySelector('.cart__items')
		const checkout = this._$cart.querySelector('.cart__checkout')
		const empty = this._$cart.querySelector('.cart__empty')

		if (this.itemsAdded.length === 0) {
			if (cartItems) {
				cartItems.remove()
				checkout.remove()
			}
			const empty = document.createElement('div')
			empty.classList.add('cart__empty')
			empty.innerText = 'Your cart is empty.'
			this._$cart.appendChild(empty)

			return
		}
		if (empty) {
			empty.remove()
		}

		const $cart_items = document.createElement('div')
		$cart_items.classList.add('cart__items')

		this.itemsAdded.forEach(({ item_id, quantity }) => {
			const item = this._products.find((product) => product[this._uniqueField] == item_id)
			const $cart_item = this.getCartItem(item, quantity)
			$cart_items.appendChild($cart_item)
		})

		if (cartItems) {
			cartItems.replaceWith($cart_items)
		} else {
			this._$cart.appendChild($cart_items)
		}
		const deleteBtns = document.querySelectorAll(`.cart-item__delete`)
		deleteBtns.forEach((deleteBtn, index) => {
			deleteBtn.addEventListener('click', () => {
				this.delete(index)
			})
		})

		if (!checkout) {
			this.insertCheckout()
		}
	}

	insertCheckout() {
		this._$cart.insertAdjacentHTML(
			'beforeend',
			`
         <div class="cart__checkout">
				<button class="button">Checkout</button>
			</div>
      `,
		)
	}

	updatePanel(product_id) {
		const quantitySpan = document.querySelector(`[data-${QUANTITY_DISPLAY_DATASET_ATTRIBUTE}="${product_id}"]`)
		if (!quantitySpan) return

		const quantity = this.itemsSelected.find((item) => item.item_id === product_id)?.quantity

		quantitySpan.innerText = quantity || 0
	}

	select(item_id) {
		const idx = this.itemsSelected.findIndex((_item) => _item.item_id === item_id)

		if (idx !== -1) {
			this.itemsSelected[idx].quantity++
		} else {
			this.itemsSelected.push({
				item_id,
				quantity: 1,
			})
		}

		this.updatePanel(item_id)
	}

	remove(item_id) {
		const idx = this.itemsSelected.findIndex((item) => item.item_id == item_id)
		if (idx === -1) return

		if (this.itemsSelected[idx].quantity === 1) {
			this.itemsSelected = this.itemsSelected.filter((item) => item.item_id != item_id)
		} else {
			this.itemsSelected[idx].quantity--
		}

		this.updatePanel(item_id)
	}

	getAll() {
		return this.itemsAdded
	}

	show() {
		this._$cart.classList.toggle('opened')
	}

	hide() {
		this._$cart.classList.remove('opened')
	}
}
