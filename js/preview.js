const PREVIEW_CONTAINER_SELECTOR = '#preview'
const MAIN_IMAGE_CONTAINER_CLASS = 'preview__main-image'
const MAIN_IMAGE_CLASS = 'preview__full-size-image'
const OPTIONS_CLASS = 'preview__options'
const PREVIEW_IMAGE_CLASS = 'preview__image'
const PREVIEW_IMAGE_CHOSEN_CLASS = 'chosen'
const LIGHTBOX_IMAGE_CHOSEN_CLASS = 'lightbox-chosen'
const PREV_ARROW_CLASS = 'preview__prev-btn'
const NEXT_ARROW_CLASS = 'preview__next-btn'
const CLOSE_CROSS_CLASS = 'lightbox__close-btn'

const PREV_ARROW_IMAGE_SRC = '/images/icon-previous.svg'
const NEXT_ARROW_IMAGE_SRC = '/images/icon-next.svg'
const CLOSE_CROSS_IMAGE_SRC = '/images/icon-close.svg'
const CAROUSEL_DIRECTION_CSS_VARIABLE = '--preview-options-carousel-axis'

class ImagesCounter {
	constructor(chosenImageClass) {
		this.chosenImageClass = chosenImageClass
	}

	initialize(images, $mainImage, $previewImages, startIndex) {
		this.images = images
		this.$mainImage = $mainImage
		this.$previewImages = $previewImages
		this.moveTo(startIndex || 0)
	}

	moveTo(index) {
		console.log('cur: ', this.currentImageIndex)
		console.log('to: ', index)
		this.$previewImages[this.currentImageIndex || 0].classList.remove(this.chosenImageClass)
		this.$previewImages[index].classList.add(this.chosenImageClass)
		this.currentImageIndex = index
		this.$mainImage.src = this.images[this.currentImageIndex].full
	}

	moveNext() {
		this.moveTo(this.currentImageIndex === this.images.length - 1 ? 0 : this.currentImageIndex + 1)
	}

	movePrev() {
		this.moveTo(this.currentImageIndex === 0 ? this.images.length - 1 : this.currentImageIndex - 1)
	}
}

export class Preview extends ImagesCounter {
	currentOffset = 0
	currentAxis = null

	constructor(preview_container_selector, images, config) {
		super(PREVIEW_IMAGE_CHOSEN_CLASS)
		this.config = { ...config }
		const [mainImageContainer, mainImage] = this.createMainImageContainer()
		this.initialize(images, mainImage, this.createPreviewImages(images))
		this.$mainImageContainer = mainImageContainer

		this.$root = document.querySelector(preview_container_selector)
		this.$previewImagesFlexContainer = this.createPreviewImagesFlexContainer(this.$previewImages)
		this.$root.append(this.$mainImageContainer, this.$previewImagesFlexContainer)

		this.startResizeHandler()
		this.startArrowsHandlers()
		this.startOpenLightboxHandler()
	}

	createMainImageContainer() {
		const mainImageContainer = document.createElement('div')
		mainImageContainer.classList.add(MAIN_IMAGE_CONTAINER_CLASS)

		const mainImage = document.createElement('img')
		mainImage.classList.add(MAIN_IMAGE_CLASS)
		mainImageContainer.appendChild(mainImage)

		const prevBtn = document.createElement('button')
		prevBtn.classList.add(PREV_ARROW_CLASS)
		const prevBtnImg = document.createElement('img')
		prevBtnImg.src = PREV_ARROW_IMAGE_SRC
		prevBtn.appendChild(prevBtnImg)

		const nextBtn = document.createElement('button')
		nextBtn.classList.add(NEXT_ARROW_CLASS)
		const nextBtnImg = document.createElement('img')
		nextBtnImg.src = NEXT_ARROW_IMAGE_SRC
		nextBtn.appendChild(nextBtnImg)

		mainImageContainer.append(prevBtn, nextBtn)

		return [mainImageContainer, mainImage]
	}

	createPreviewImagesFlexContainer(previewImages) {
		const flex = document.createElement('div')
		flex.classList.add(OPTIONS_CLASS)
		if (this.isEnoughSpaceNotToScroll()) {
			flex.style.gap = 'initial'
			flex.style.justifyContent = 'space-between'
		}
		flex.append(...previewImages)
		return flex
	}

	createPreviewImages(images) {
		return images.map(({ thumbnail }, index) => {
			const img = document.createElement('img')
			img.src = thumbnail

			const previewImage = document.createElement('div')
			previewImage.classList.add(PREVIEW_IMAGE_CLASS)

			previewImage.appendChild(img)

			previewImage.addEventListener('click', () => {
				if (!this.isEnoughSpaceNotToScroll()) this.movePreviewOptions(this.currentImageIndex, index)
				this.moveTo(index)
			})

			return previewImage
		})
	}

	startArrowsHandlers() {
		this.$mainImageContainer.querySelector(`.${PREV_ARROW_CLASS}`).addEventListener('click', () => {
			this.movePrev()
		})
		this.$mainImageContainer.querySelector(`.${NEXT_ARROW_CLASS}`).addEventListener('click', () => {
			this.moveNext()
		})
	}

	movePreviewOptions(from, to) {
		const { itemSize, gap, totalSize } = this.config

		if (this.currentOffset * 2 > totalSize && to > from) return

		const fragmentSize = itemSize / 2

		let newOffset = this.currentOffset

		if (from === 0) {
			newOffset += (to - from) * itemSize + (to - from - 1) * gap - fragmentSize
		} else {
			newOffset += (to - from) * (itemSize + gap)
		}

		if (newOffset < 0) newOffset = 0

		this.$previewImages.forEach((previewImage) => {
			this.currentAxis = this.getCarouselDirection()

			previewImage.style.transform = `translate${this.currentAxis}(${-newOffset}px)`
		})

		this.currentOffset = newOffset
	}

	startResizeHandler() {
		window.addEventListener('resize', () => {
			const axis = this.getCarouselDirection()
			if (this.currentAxis !== axis && !this.isEnoughSpaceNotToScroll()) {
				this.currentOffset = 0
				this.movePreviewOptions(0, this.currentImageIndex)
			}
		})
	}

	startOpenLightboxHandler() {
		this.$mainImage.addEventListener('click', () => {
			this.openLightbox()
		})
	}

	createLightbox() {
		const lightbox = document.createElement('div')
		lightbox.classList.add('lightbox')
		lightbox.childNodes.forEach((child) => {
			lightbox.removeChild(child)
		})
		lightbox.appendChild(this.$root.cloneNode(true))
		lightbox.children[0].classList.add('lightbox-preview')
		lightbox.children[0].style.flex = '0 0 550px'

		const close = document.createElement('button')
		close.classList.add(CLOSE_CROSS_CLASS)
		const closeImg = document.createElement('img')
		closeImg.src = CLOSE_CROSS_IMAGE_SRC
		close.appendChild(closeImg)

		lightbox.querySelector(`.${MAIN_IMAGE_CONTAINER_CLASS}`).appendChild(close)

		return lightbox
	}

	openLightbox() {
		const lightbox = this.createLightbox()
		const mainImage = lightbox.querySelector(`.${MAIN_IMAGE_CLASS}`)
		const previewImgs = lightbox.querySelectorAll(`.${PREVIEW_IMAGE_CLASS}`)
		const closeBtn = lightbox.querySelector(`.${CLOSE_CROSS_CLASS}`)

		const lightboxImageCounter = new ImagesCounter(LIGHTBOX_IMAGE_CHOSEN_CLASS)

		lightboxImageCounter.initialize(this.images, mainImage, previewImgs, this.currentImageIndex)

		previewImgs.forEach((previewImg, index) => {
			previewImg.style.transform = 'translate(0,0)'
         if (previewImg.classList.contains(PREVIEW_IMAGE_CHOSEN_CLASS)) {
            previewImg.classList.remove(PREVIEW_IMAGE_CHOSEN_CLASS)
            previewImg.classList.add(LIGHTBOX_IMAGE_CHOSEN_CLASS)
         }
			previewImg.addEventListener('click', () => {
				lightboxImageCounter.moveTo(index)
			})
		})

		lightbox.querySelector(`.${PREV_ARROW_CLASS}`).addEventListener('click', () => {
			lightboxImageCounter.movePrev()
		})

		lightbox.querySelector(`.${NEXT_ARROW_CLASS}`).addEventListener('click', () => {
			lightboxImageCounter.moveNext()
		})

		closeBtn.addEventListener('click', () => {
         lightbox.remove()
		})

		document.body.appendChild(lightbox)
	}

	getCarouselDirection() {
		const root = document.querySelector(':root')
		const style = getComputedStyle(root)
		const axis = style.getPropertyValue(CAROUSEL_DIRECTION_CSS_VARIABLE)
		return axis.trim()
	}

	isEnoughSpaceNotToScroll() {
		const { totalSize } = this.config
		const occupied = this.getOccupiedSize()
		return !(occupied > totalSize)
	}

	getOccupiedSize() {
		const { itemSize, gap } = this.config
		return itemSize * this.images.length + (this.images.length - 1) * gap
	}
}
