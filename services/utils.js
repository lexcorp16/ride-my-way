const cleanData = (input) => {
  const withoutNewlines = input.replace(/\r?\n|\r/g, '');
  const withoutMultipleSpaces = withoutNewlines.replace(/ {1,}/g, ' ');

  return withoutMultipleSpaces.trim();
};

export default cleanData;
