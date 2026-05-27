/// <reference types="@electron-forge/plugin-vite/forge-vite-env" />

declare module '*.png?url' {
  const src: string;
  export default src;
}
declare module '*.webp?url' {
  const src: string;
  export default src;
}
declare module '*.svg?url' {
  const src: string;
  export default src;
}
