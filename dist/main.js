"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const figlet_1 = require("figlet");
const commander_1 = require("commander");
const program = new commander_1.Command();
console.log((0, figlet_1.textSync)("Any"));
program
    .option("-n, --name <name>", "Your name")
    .parse(process.argv);
const options = program.opts();
//# sourceMappingURL=main.js.map