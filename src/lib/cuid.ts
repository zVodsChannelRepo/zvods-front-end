const bigLength = 32;
export const isCuid = (id: string, { minLength, maxLength }: { minLength: number, maxLength: number } = { minLength: 2, maxLength: bigLength }) => {
  const length = id.length;
  const regex = /^[0-9a-z]+$/;

  try {
    if (
      typeof id === "string" &&
      length >= minLength &&
      length <= maxLength &&
      regex.test(id)
    )
      return true;
  } finally {
  }

  return false;
};