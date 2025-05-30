// /backend/utils/parseResume.js
import { promises as fs } from 'fs';
import pdfParse from 'pdf-parse/lib/pdf-parse.js'; // Bypasses test files
export const parseResume = async (filePath) => {
 // Validate input
 if (!filePath || typeof filePath !== 'string') {
 console.warn('Invalid file path provided');
 return [];
 }
 try {
 // Verify file exists and is accessible
 try {
 await fs.access(filePath);
 } catch (err) {
 console.warn(`File access error: ${err.message}`);
 return [];
 }

 // Read file with size limit (5MB)
 const stats = await fs.stat(filePath);
 if (stats.size > 5 * 1024 * 1024) {
 console.warn('File too large (>5MB)');
 return [];
 }
 const buffer = await fs.readFile(filePath);

 // Parse with timeout
 const parsePromise = pdfParse(buffer);
 const timeoutPromise = new Promise((_, reject) =>
 setTimeout(() => reject(new Error('Parse timeout')), 10000)
 );
 const data = await Promise.race([parsePromise, timeoutPromise]);

 // Improved skill extraction
 const content = data.text.toLowerCase();
 const skillPatterns = [
 /\bjavascript\b/i, /\breact\b/i, /\bnode\.?js\b/i,
 /\bexpress\b/i, /\bmongo\s?db\b/i, /\bhtml\b/i,
 /\bcss\b/i, /\bpython\b/i, /\bjava\b/i, /\bsql\b/i,
 /\bdocker\b/i, /\baws\b/i, /\bgit\b/i,
 /\btypescript\b/i, /\bnext\.?js\b/i
 ];
 return skillPatterns
 .filter(pattern => pattern.test(content))
 .map(pattern => pattern.source.replace(/\\b|\\\?|\(\.\?js\)|\/ig?/g, ''));

 } catch (err) {
 console.error(`Resume parsing failed: ${err.message}`);
 return [];

 }
};
