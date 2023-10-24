## How to found which theme system prefers

```typescript
  const handleThemeChange = () => {
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme:dark').matches)
    ) {
      setMode('dark')
      document.documentElement.classList.add('dark')
    } else {
      setMode('light')
      document.documentElement.classList.remove('dark')
    }
  }

  useEffect(() => {
    handleThemeChange()
  }, [mode])
```