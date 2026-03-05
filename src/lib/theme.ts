export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'aimorpheus_theme';

export const themeService = {
  getTheme(): Theme {
    if (typeof window === 'undefined') return 'dark';
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return (saved as Theme) || 'dark';
    } catch {
      return 'dark';
    }
  },

  setTheme(theme: Theme): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, theme);
      applyTheme(theme);
    } catch {
      applyTheme(theme);
    }
  },

  toggleTheme(): Theme {
    const current = this.getTheme();
    const newTheme = current === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
    return newTheme;
  },
};

export function initializeTheme(): void {
  if (typeof window === 'undefined') return;
  
  // Get saved theme from localStorage
  const savedTheme = localStorage.getItem(STORAGE_KEY) as Theme | null;
  const theme = savedTheme || 'dark';
  
  console.log('Initializing theme:', theme);
  
  // Apply theme immediately on load
  applyTheme(theme);
}

// Auto-initialize theme on module load (before React components mount)
if (typeof window !== 'undefined') {
  initializeTheme();
}

export function applyTheme(theme: Theme): void {
  if (typeof window === 'undefined') return;
  
  const htmlElement = document.documentElement;
  const bodyElement = document.body;
  
  console.log('=== APPLYING THEME ===', theme);
  
  // Set data attribute
  htmlElement.setAttribute('data-theme', theme);
  console.log('Set data-theme attribute to:', theme);
  
  // Add/remove classes
  htmlElement.classList.remove('dark', 'light');
  htmlElement.classList.add(theme);
  console.log('Classes updated:', htmlElement.className);
  
  // Apply inline styles directly for immediate effect
  if (theme === 'light') {
    htmlElement.style.colorScheme = 'light';
    if (bodyElement) {
      bodyElement.style.backgroundColor = '#ffffff';
      bodyElement.style.color = '#1a1a1a';
    }
  } else {
    htmlElement.style.colorScheme = 'dark';
    if (bodyElement) {
      bodyElement.style.backgroundColor = '#0a0a0a';
      bodyElement.style.color = '#ededed';
    }
  }
  
  // Force repaint
  void htmlElement.offsetHeight;
  
  console.log('=== THEME APPLIED ===');
}
