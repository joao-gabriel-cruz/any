import { Command } from "commander"
import { createFeature } from "./use-cases/feature"
import { initStore } from "./use-cases/init"

function main() {
  const program = new Command()

  program
    .option("-f, --feature <feature>", "new feature")
    .option("-i, --init", "init project")
    .parse(process.argv)

  const options = program.opts()
  console.log(options);

  if (options.init) {
    initStore()
    return;
  }

  if (options.feature) {
    console.log(options.feature);
    
    createFeature(options.feature)
  }
}

main()
