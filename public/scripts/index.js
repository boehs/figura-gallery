document.addEventListener("DOMContentLoaded", () => {

    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.body.classList.add('dark')
        document.querySelector("body > section.relative.w-full.px-8.text-gray-700.dark\\:text-white.bg-white.dark\\:bg-gray-800.body-font > div > div > a:nth-child(2)").classList.remove('hidden')
    } else {
        document.body.classList.remove('dark')
        document.querySelector("body > section.relative.w-full.px-8.text-gray-700.dark\\:text-white.bg-white.dark\\:bg-gray-800.body-font > div > div > a:nth-child(1)").classList.remove('hidden')
    }
    
})

function changeTheme(theme) {
    localStorage.theme = theme

    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.body.classList.add('dark')
        document.querySelector("body > section.relative.w-full.px-8.text-gray-700.dark\\:text-white.bg-white.dark\\:bg-gray-800.body-font > div > div > a:nth-child(1)").classList.add('hidden')
        document.querySelector("body > section.relative.w-full.px-8.text-gray-700.dark\\:text-white.bg-white.dark\\:bg-gray-800.body-font > div > div > a:nth-child(2)").classList.remove('hidden')
    } else {
        document.body.classList.remove('dark')
        document.querySelector("body > section.relative.w-full.px-8.text-gray-700.dark\\:text-white.bg-white.dark\\:bg-gray-800.body-font > div > div > a:nth-child(1)").classList.remove('hidden')
        document.querySelector("body > section.relative.w-full.px-8.text-gray-700.dark\\:text-white.bg-white.dark\\:bg-gray-800.body-font > div > div > a:nth-child(2)").classList.add('hidden')
    }
}