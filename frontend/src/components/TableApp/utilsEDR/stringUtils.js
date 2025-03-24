export const toCamelCase = (str) => 
    str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  
export const toSnakeCase = (str) =>
    str.replace(/([A-Z])/g, '_$1').toLowerCase();