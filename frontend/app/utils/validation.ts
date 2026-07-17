export const validateTask = (
  title: string,
  description: string,
): string | null => {
  const cleanTitle = title.trim();
  const cleanDescription = description.trim();

  if (!cleanTitle) return "Task title cannot be empty or contain only spaces.";

  if (!/[a-zA-Z]/.test(cleanTitle)) {
    return "Task title must contain at least one English letter.";
  }

  const englishRegex = /^[a-zA-Z0-9\s.,!?'"\-()]*$/;
  if (!englishRegex.test(cleanTitle)) {
    return "Please use English letters only.";
  }

  if (cleanDescription.length > 0 && !/[a-zA-Z0-9]/.test(cleanDescription)) {
    return "Description cannot consist only of special characters.";
  }

  return null;
};
