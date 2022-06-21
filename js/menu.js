const menuButton = document.getElementById('nav-toggle')
const closeButton = document.getElementById('nav-close')
const menu = document.getElementById('nav-menu')

const toggleMenu = (action) => {
	menu.classList[action]('nav__menu--showed')
}

menuButton.addEventListener('click', () => {
	toggleMenu('add')
})

closeButton.addEventListener('click', () => {
	toggleMenu('remove')
})

// overlay click -> hide menu
menu.addEventListener('click', (e) => {
	if (e.target.closest('.nav__menu-panel')) return
	e.stopPropagation()
	toggleMenu('remove')
})