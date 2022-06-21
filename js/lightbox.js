export const openLightbox = (preview, images) => {
   const lightbox = document.getElementById('lightbox')
	lightbox.classList.add('opened')
	lightbox.childNodes.forEach((child) => {
		lightbox.removeChild(child)
	})
	lightbox.appendChild(preview.cloneNode(true))
	lightbox.children[0].classList.add('lightbox-preview')
	lightbox.children[0].style.flex = '0 0 550px'

	const previewImgs = lightbox.querySelectorAll('.preview__image')

   console.log(previewImgs)
	previewImgs.forEach((previewImg, index) => {
      const imgSrc = previewImg.querySelector('img').src
      previewImg.style.transform = 'translate(0,0)'
		previewImg.addEventListener('click', () => {
			const chosenPreviewImage = lightbox.querySelector('.chosen')
			const mainImage = lightbox.querySelector('.preview__main-image').querySelector('img')
			chosenPreviewImage.classList.remove('chosen')
			previewImg.classList.add('chosen')
			mainImage.src = images[index].full
		})
	})
}

// lightbox.addEventListener('click', (e) => {
// 	if (e.target.closest('.preview__image')) return
// 	lightbox.classList.remove('opened')
// })
