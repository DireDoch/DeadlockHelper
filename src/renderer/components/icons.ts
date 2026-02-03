/**
 * Heroicons integration for DeadlockHelper
 * 
 * This file provides icon components using Heroicons SVG icons.
 * Since we're using vanilla TypeScript (not React), we use SVG strings
 * extracted from Heroicons.
 * 
 * Documentation complète : .cursor/HEROICONS.md
 * Référence rapide : .cursor/ICONS_REFERENCE.md
 * 
 * Usage:
 *   import { HomeIcon, SettingsIcon } from './icons';
 *   const html = HomeIcon('w-6 h-6 text-frosted_mint-500');
 */

/**
 * Icon registry - SVG paths from Heroicons (Outline style)
 * Source: https://heroicons.com/
 * 
 * Pour ajouter une nouvelle icône :
 * 1. Aller sur https://heroicons.com/
 * 2. Trouver l'icône et copier le SVG
 * 3. Ajouter ici avec le nom de l'icône
 * 4. Exporter la fonction en bas du fichier
 */
const ICON_REGISTRY: Record<string, string> = {
  // Navigation
  'HomeIcon': `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"></path>`,
  
  // Settings
  'Cog6ToothIcon': `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281Z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"></path>`,
  
  // Menu
  'Bars3Icon': `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"></path>`,
  
  // Close
  'XMarkIcon': `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18 18 6M6 6l12 12"></path>`,
  
  // New icons for navigation
  'BugAntIcon': `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 12.75c.733 0 1.5-.195 2.062-.532a7.5 7.5 0 0 0 2.625-3.003 7.5 7.5 0 0 1-4.687 2.625c-.384.023-.768.05-1.125.08v2.25c.375-.043.766-.087 1.125-.12A9.344 9.344 0 0 0 12 12.75Zm0 0v2.25M9 3.003a7.5 7.5 0 0 1 6 0M5.25 21.75a18.45 18.45 0 0 1-1.5-7.5v-4.5c0-1.71.54-3.32 1.5-4.5M18.75 21.75a18.49 18.49 0 0 0 1.5-7.5v-4.5c0-1.71-.54-3.32-1.5-4.5M9 6a9 9 0 0 1 6 0M15 18.75v-4.5M12 15.75v-4.5"></path>`,
  
  'TrophyIcon': `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.228a46.45 46.45 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.844 1.16v-1.801a6.772 6.772 0 0 0 1.623-.174 3 3 0 0 0 2.198-2.784M13.5 9.75a2.25 2.25 0 0 0-2.25 2.25v15.75m0 0h6.75v-15.75m-6.75 0v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21.75"></path>`,
  
  'VideoCameraIcon': `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"></path>`,
  
  'WrenchScrewdriverIcon': `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655-5.653a2.548 2.548 0 0 0-3.586-3.586l-1.757 1.757a11.25 11.25 0 0 1 5.983 5.983l1.757-1.757a2.548 2.548 0 0 0 3.586-3.586l-5.653-4.655Z"></path>`,
  
  'ChartBarIcon': `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75Zm9.75-8.25c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.875Zm9.75-3c0-.621.504-1.125 1.125-1.125h2.25C20.496.75 21 1.254 21 1.875v16.5c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V1.875Z"></path>`,
  
  'ChevronDoubleLeftIcon': `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5"></path>`,
  
  'ChevronDoubleRightIcon': `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"></path>`,
};

/**
 * Get SVG path for an icon by name
 */
function getIconPath(iconName: string): string {
  return ICON_REGISTRY[iconName] || '';
}

/**
 * Create SVG element with icon path
 */
function createSVG(path: string, className: string): string {
  return `<svg class="${className}" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    ${path}
  </svg>`;
}

/**
 * Icon component factory
 * Creates an icon function that returns HTML string
 * 
 * @param iconName - Name of the icon in the registry
 * @param defaultClassName - Default Tailwind classes
 */
export function createIcon(iconName: string, defaultClassName: string = 'w-6 h-6') {
  const path = getIconPath(iconName);
  if (!path) {
    console.warn(`Icon "${iconName}" not found in registry`);
    return (className?: string) => createSVG('', className || defaultClassName);
  }
  return (className?: string) => createSVG(path, className || defaultClassName);
}

// ============================================================================
// Exported icon functions
// ============================================================================

/**
 * Home icon - Navigation principale
 */
export const HomeIcon = (className: string = 'w-6 h-6') => {
  return createSVG(getIconPath('HomeIcon'), className);
};

/**
 * Settings icon (Cog6Tooth) - Paramètres
 */
export const SettingsIcon = (className: string = 'w-6 h-6') => {
  return createSVG(getIconPath('Cog6ToothIcon'), className);
};

/**
 * Menu icon (Bars3) - Menu hamburger
 */
export const MenuIcon = (className: string = 'w-6 h-6') => {
  return createSVG(getIconPath('Bars3Icon'), className);
};

/**
 * Close icon (XMark) - Fermer
 */
export const CloseIcon = (className: string = 'w-6 h-6') => {
  return createSVG(getIconPath('XMarkIcon'), className);
};

/**
 * Bug Ant icon - Hero Statistics
 */
export const BugAntIcon = (className: string = 'w-6 h-6') => {
  return createSVG(getIconPath('BugAntIcon'), className);
};

/**
 * Trophy icon - Leaderboards
 */
export const TrophyIcon = (className: string = 'w-6 h-6') => {
  return createSVG(getIconPath('TrophyIcon'), className);
};

/**
 * Video Camera icon - Game Overlay
 */
export const VideoCameraIcon = (className: string = 'w-6 h-6') => {
  return createSVG(getIconPath('VideoCameraIcon'), className);
};

/**
 * Wrench Screwdriver icon - Meta Items & Builds
 */
export const WrenchScrewdriverIcon = (className: string = 'w-6 h-6') => {
  return createSVG(getIconPath('WrenchScrewdriverIcon'), className);
};

/**
 * Chart Bar icon - Rank Distribution
 */
export const ChartBarIcon = (className: string = 'w-6 h-6') => {
  return createSVG(getIconPath('ChartBarIcon'), className);
};

/**
 * Chevron Double Left icon - Sidebar closed
 */
export const ChevronDoubleLeftIcon = (className: string = 'w-6 h-6') => {
  return createSVG(getIconPath('ChevronDoubleLeftIcon'), className);
};

/**
 * Chevron Double Right icon - Sidebar open
 */
export const ChevronDoubleRightIcon = (className: string = 'w-6 h-6') => {
  return createSVG(getIconPath('ChevronDoubleRightIcon'), className);
};

/**
 * Get all available icon names
 * Useful for debugging or creating icon pickers
 */
export function getAvailableIcons(): string[] {
  return Object.keys(ICON_REGISTRY);
}

/**
 * Check if an icon exists in the registry
 */
export function hasIcon(iconName: string): boolean {
  return iconName in ICON_REGISTRY;
}
