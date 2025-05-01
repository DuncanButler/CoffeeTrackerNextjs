// filepath: c:\Users\dunca\source\learning\FunWithJo\coffee-tracker\lib\secureFs.js
import fs from 'fs';
import path from 'path';

/**
 * Secure file system operations to prevent directory traversal attacks
 */

// Whitelisted base directory for all operations
const BASE_DIR = path.join(process.cwd(), 'data');

/**
 * Ensures a path is within the allowed directory
 * @param {string} filePath - The path to validate
 * @throws {Error} If the path is outside the allowed directory
 * @returns {string} The normalized absolute path
 */
function validatePath(filePath) {
  // Normalize path
  const normalizedPath = path.normalize(filePath);
  const absolutePath = path.resolve(normalizedPath);
  
  // Check if the path is within the allowed directory
  if (!absolutePath.startsWith(BASE_DIR)) {
    throw new Error('Access denied: Attempted to access file outside of allowed directory');
  }
  
  return absolutePath;
}

/**
 * Secure wrapper for fs.readFileSync
 * @param {string} filePath - Path to read
 * @param {string|object} options - Options for reading
 * @returns {string|Buffer} - File contents
 */
export function secureReadFileSync(filePath, options) {
  const safePath = validatePath(filePath);
  return fs.readFileSync(safePath, options);
}

/**
 * Secure wrapper for fs.writeFileSync
 * @param {string} filePath - Path to write to
 * @param {string|Buffer} data - Data to write
 * @param {object} options - Options for writing
 */
export function secureWriteFileSync(filePath, data, options) {
  const safePath = validatePath(filePath);
  return fs.writeFileSync(safePath, data, options);
}

/**
 * Secure wrapper for fs.existsSync
 * @param {string} filePath - Path to check
 * @returns {boolean} - Whether the file exists
 */
export function secureExistsSync(filePath) {
  try {
    const safePath = validatePath(filePath);
    return fs.existsSync(safePath);
  } catch (error) {
    // If path validation fails, return false
    return false;
  }
}

/**
 * Secure wrapper for fs.mkdirSync
 * @param {string} dirPath - Path to create
 * @param {object} options - Options for directory creation
 */
export function secureMkdirSync(dirPath, options) {
  const safePath = validatePath(dirPath);
  return fs.mkdirSync(safePath, options);
}

/**
 * Initialize data directory securely
 */
export function initializeDataDir() {
  // Create the base directory if it doesn't exist
  if (!fs.existsSync(BASE_DIR)) {
    fs.mkdirSync(BASE_DIR, { recursive: true });
  }
  return BASE_DIR;
}
