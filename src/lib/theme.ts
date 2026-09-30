export type Theme = "light" | "dark";
export const themeStorageKey = "osel-theme";
// Runs in the document head before content is painted. Only the root attribute differs from SSR.
export const themeInitializationScript = `(()=>{let theme;try{theme=localStorage.getItem("${themeStorageKey}")}catch{}if(theme!=="light"&&theme!=="dark")theme=window.matchMedia?.("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.dataset.theme=theme})()`;
