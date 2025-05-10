import CryptoJS from "crypto-js";

const secretKey = "your-strong-secret-key"; // Keep this secure

// Encrypt Data
export const encryptData = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
};

// Decrypt Data
export const decryptData = (encryptedData) => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};
