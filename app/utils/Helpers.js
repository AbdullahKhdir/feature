/**
 * @function isDarkMode
 * @description Identify if the browser is in dark mode or not
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
 * @returns boolean
*/
export const isDarkMode     = () => window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

/**
 * @function scrollToTop
 * @description Scrolls to the top of the page
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
 * @param Object dom_element
 * @returns void
*/
export const scrollToTop    = (dom_element) => dom_element.scrollIntoView({ behavior: "smooth", block: "start" });

/**
 * @function scrollToBottom
 * @description Scrolls to the bottom of the page
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
 * @param Object dom_element 
 * @returns void
*/
export const scrollToBottom = (dom_element) => dom_element.scrollIntoView({ behavior: "smooth", block: "end" });

/**
 * @function getUnique
 * @description Removes all duplicates from an array
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
 * @param Array arr
 * @returns array
*/
export const getUnique      = (arr) => [...new Set(arr)];

/**
 * @function getConstants
 * @description Shuffles the values of an array
 * @version 1.0.0
 * @author Khdir, Abdullah <abdullahkhder77@gmail.com>
 * @param Array arr
 * @returns array
*/
export const shuffleArray   = (arr) => arr.sort(() => Math.random() - 0.5);
