#!/usr/bin/env node

import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";
import path from "path";
import { Command } from "commander";
import { CreateWebComponentCommand } from "./commands";
import { BaseCommand } from "./commands/base-command";

clear();

const logBanner = (): void => {
  console.log(
    chalk.blue(
      figlet.textSync("OpenSCD", {
        font: "4Max",
        horizontalLayout: "full",
      })
    )
  );
};

const runProgram = (): void => {
  const program = new Command();

  const commands: BaseCommand<any>[] = [new CreateWebComponentCommand()];

  commands.forEach((command) => {
    program
      .command(command.command())
      .alias(command.alias())
      .description(command.description())
      .action((args) => command.action(args));
  });

  program.parse(process.argv);
};

const run = (): void => {
  logBanner();
  runProgram();
};

run();
