import fs from "fs";
import path from "path";

const globalDir = "C:/DressMe/scratch/canonical-prisma-pgdata/global";

try {
  const files = fs.readdirSync(globalDir);
  const words = new Set();
  
  for (const file of files) {
    const filePath = path.join(globalDir, file);
    const stat = fs.statSync(filePath);
    if (!stat.isFile()) continue;
    
    // Skip pg_control or pg_internal.init as they might be large/noise
    if (file === "pg_control" || file === "pg_internal.init") continue;
    
    const data = fs.readFileSync(filePath);
    let currentString = "";
    
    for (let i = 0; i < data.length; i++) {
      const char = data[i];
      if (char >= 32 && char <= 126) {
        currentString += String.fromCharCode(char);
      } else {
        if (currentString.length >= 3 && currentString.length <= 40) {
          // Look for words that look like username patterns
          if (/^[a-zA-Z][a-zA-Z0-9_\.\-]+$/.test(currentString)) {
            // Exclude common pg keywords/noise
            const lowercase = currentString.toLowerCase();
            if (!["pg_", "sql_", "index", "toast", "schema", "table", "btree", "primary", "check", "foreign", "trigger"].some(p => lowercase.startsWith(p))) {
              words.add(currentString);
            }
          }
        }
        currentString = "";
      }
    }
  }
  
  console.log("Extracted candidate words from global tables:");
  console.log(Array.from(words).sort().join("\n"));
} catch (e) {
  console.error("Error reading files:", e);
}
