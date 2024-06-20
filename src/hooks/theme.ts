type Themes = 'dark' | 'light'
export function getTheme() {
  const isDark = document.documentElement.classList.contains('dark')
  const toggleValue = !isDark ? 'dark' : 'light' as Themes
  return { isDark: isDark, name: isDark ? 'dark' : 'light', toggleValue }
}
export function toggleTheme() {
  const theme = getTheme()
  setTheme(theme.toggleValue)
}

export function setTheme(theme: 'dark' | 'light') {
  window.localStorage.setItem('theme', theme)
  if (theme == 'dark') {
    document.documentElement.classList.remove('dark')
  } else {
    document.documentElement.classList.add('dark')
  }
}