export function escapeLucene(value) {
  const specials = ['+', '-', '&', '|', '!', '(', ')', '{', '}', '[', ']', '^', '"', '~', '*', '?', ':', '\\', '/'];
  const regexp = new RegExp('(\\' + specials.join('|\\') + ')', 'g');
  return value.replace(regexp, '\\$1');
}
