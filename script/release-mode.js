const fs = require("fs");

fs.writeFileSync(
    'src/debug.ts',
    `export const DEBUG = false;`
);