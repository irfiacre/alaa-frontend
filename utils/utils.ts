export const generateRandomUUID = (): string => {
  return crypto.randomUUID();
};

export const generateTextID = (baseText: string): string => {
  const condensedCharacters = baseText.toLocaleLowerCase().replace(/\s/g, "");

  return condensedCharacters.length > 30
    ? condensedCharacters.slice(0, 30)
    : condensedCharacters;
};
