export const validateAndFormatDate = (
  date: string | undefined
): string | null => {
  if (!date) return null;

  const cleanedDate = date.replace(/[^\d\-]/g, "");

  const parsedDate = new Date(cleanedDate);
  if (isNaN(parsedDate.getTime())) {
    console.warn(`Invalid date encountered: ${date}`);
    return null;
  }

  return parsedDate.toISOString().split("T")[0];
};
