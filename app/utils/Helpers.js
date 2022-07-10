export const isDarkMode     = () => window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

export const scrollToTop    = (element) => element.scrollIntoView({ behavior: "smooth", block: "start" });

export const scrollToBottom = (element) => element.scrollIntoView({ behavior: "smooth", block: "end" });

export const getUnique      = (arr) => [...new Set(arr)];

export const shuffleArray   = (arr) => arr.sort(() => Math.random() - 0.5);
