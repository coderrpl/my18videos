export const urlConverter = (url) => {
  let words = url;
  words = words.replace(/&/g, "and");
  words = words.replace(/\s/g, "-");
  return words;
};
