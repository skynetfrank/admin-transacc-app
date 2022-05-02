export const isGeneric = code => {
  if (code?.charAt(code.length - 2) === '-') {
    return true;
  }
  return false;
};
