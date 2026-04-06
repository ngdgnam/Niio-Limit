'use strict';

var CryptoJS = require("crypto-js");

/**
 * Encrypt the text using the CryptoJS library and return the encrypted text as a Base64 string.
 * @param Data - The data to be encrypted.
 * @returns A string of characters that represent the encrypted data.
 */
module.exports.Encrypt = function Encrypt(Data) {
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(Data));
};

/**
 * Decrypt the data using the CryptoJS library, and return the decrypted data as a string.
 * @param Data - The data to be decrypted.
 * @returns The decrypted data.
 */

module.exports.Decrypt = function Decrypt(Data) {
    try {
        return CryptoJS.enc.Base64.parse(String(Data)).toString(CryptoJS.enc.Utf8);
    } catch (error) {
        throw new Error("Security Base decryption failed: malformed Base64/UTF-8 data. The encrypted AppState may be corrupted or the stored key is invalid.");
    }
};
