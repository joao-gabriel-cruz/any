import { Command } from "commander"
import { createFeature } from "./use-cases/feature"
import { initStore } from "./use-cases/init"

const program = new Command()

program
  .option("-f, --feature <feature>", "new feature")
  .option("-i, --init", "init project")
  .parse(process.argv)

const options = program.opts()
console.log(options);

Object.keys(options).includes("feature") && createFeature(options.feature)
Object.keys(options).includes("init") && initStore()



