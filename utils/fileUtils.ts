export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // The result is a data URL, e.g., "data:image/png;base64,iVBORw0KGgo...".
        // We need only the base64 part.
        const base64String = reader.result.split(',')[1];
        if (base64String) {
          resolve(base64String);
        } else {
          reject(new Error('Failed to extract base64 string from data URL.'));
        }
      } else {
        reject(new Error('FileReader result is not a string.'));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};
