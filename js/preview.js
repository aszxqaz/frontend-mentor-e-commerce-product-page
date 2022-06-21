

// preview
const preview = document.getElementById('preview')

const previewImages = document.querySelectorAll('.preview__image')

previewImages.forEach((previewImage) => {
	const imgSrc = previewImage.querySelector('img').src
	previewImage.addEventListener('click', () => {
		const chosenPreviewImage = document.querySelector('.preview__image.chosen')
		const mainImage = document.querySelector('.preview__main-image').querySelector('img')
		chosenPreviewImage.classList.remove('chosen')
		previewImage.classList.add('chosen')
		mainImage.src = imgSrc
	})
})

// lightbox --

const lightbox = document.getElementById('lightbox')

const openLightbox = () => {
	lightbox.classList.add('opened')
	lightbox.childNodes.forEach((child) => {
		lightbox.removeChild(child)
	})

	lightbox.appendChild(preview.cloneNode(true))
	lightbox.children[0].classList.add('lightbox-preview')
	lightbox.children[0].style.flex = '0 0 550px'

	const previewImgs = lightbox.querySelectorAll('.preview__image')
   console.log(previewImgs)
	previewImgs.forEach((previewImg) => {
      const imgSrc = previewImg.querySelector('img').src
		previewImg.addEventListener('click', () => {
			const chosenPreviewImage = lightbox.querySelector('.chosen')
			const mainImage = lightbox.querySelector('.preview__main-image').querySelector('img')
         console.log(mainImage)
			chosenPreviewImage.classList.remove('chosen')
			previewImg.classList.add('chosen')
			mainImage.src = imgSrc
		})
	})
}

document.querySelector('.preview__main-image').addEventListener('click', openLightbox)

lightbox.addEventListener('click', (e) => {
	if (e.target.closest('.preview__image')) return
	lightbox.classList.remove('opened')
})
