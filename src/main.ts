#! /usr/bin/env node
import { Command } from "commander"
import {  createCombine, createCombineAndFeature, createFeature } from "./use-cases/feature"
import { initStore } from "./use-cases/init"
import fs from "fs"
import { getVersion } from "./use-cases/configs"

function main() {
  const program = new Command()

  program
    .option("-f, --feature <feature>", "new feature")
    .option("-i, --init", "init project")
    .option("-c, --combine <combine>", "combine feature")
    .option("-v, --version ", "version project") 
    .parse(process.argv)

  const options = program.opts()

  if (options.init) {
    initStore()
    return;
  }

  if (!options.feature && options.combine) {
    const existStore = fs.existsSync(`src/redux-store`);


    if (!existStore) {
      console.error(`redux-store does not exist`);
      return
    }

    createCombine(options.combine)
    return;
  }

  if (options.feature && options.combine) {
    const existStore = fs.existsSync(`src/redux-store`);


    if (!existStore) {
      console.error(`redux-store does not exist run init command`);
      return
    }
    createCombineAndFeature(options.feature, options.combine)
    return;
  }

  if (options.feature) {
    const existStore = fs.existsSync(`src/redux-store`);


    if (!existStore) {
      console.error(`redux-store does not exist run init command`);
      return
    }
    
    createFeature(options.feature)
  }

  if (options.version) {
    getVersion()
  }


}



main()
