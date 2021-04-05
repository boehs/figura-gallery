let darkMode = false

document.addEventListener("DOMContentLoaded", () => {
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        darkMode = true
    } else if (document.body.classList.contains("dark-mode")) {
        darkMode = true
    }

    if (darkMode) {
        if (!document.body.classList.contains("dark-mode")) {
            document.body.classList.add("dark-mode")
        }
    } else if (document.body.classList.contains("dark-mode")) {
        document.body.classList.remove("dark-mode")
    }
    
})