import { access, existsSync, mkdirSync, writeFile } from "fs";
import inquirer, { Question, Answers } from "inquirer";
import { TemplateEngine } from "../template/template-engine";
import { BaseCommand } from "./base-command";
import { join } from "path";
import { paramCase, pascalCase } from "change-case";

interface WebComponentModel {
  name: string;
  className: string;
  selector: string;
}

export class CreateWebComponentCommand extends BaseCommand<void> {
  private templateEngine: TemplateEngine;

  constructor() {
    super();
    this.templateEngine = new TemplateEngine();
  }

  command(): string {
    return "web-component";
  }

  description(): string {
    return "Create a Web Component for OpenSCD";
  }

  alias(): string {
    return "wc";
  }

  action() {
    inquirer.prompt(this.questions()).then((answers) => {
      const { input } = answers;

      const cwd = process.cwd();

      const inputPartials: string[] = input.split("/");

      const name: string = inputPartials[inputPartials.length - 1];
      const path = join(
        cwd,
        inputPartials.length > 1
          ? inputPartials.join("/").replace(`/${name}`, "").trim()
          : ""
      );

      if (!existsSync(path)) {
        mkdirSync(path, { recursive: true });
      }

      const model: WebComponentModel = {
        name: name,
        selector: paramCase(`oscd-${name}`),
        className: pascalCase(`oscd ${name}`),
      };

      this.templateEngine
        .compileFile(
          join(__dirname, "../", "../", "templates", "web-component.ts.hbs"),
          model
        )
        .then((res) => {
          writeFile(
            join(path, `oscd-${paramCase(name)}.ts`),
            res,
            {
              encoding: "utf-8",
            },
            (err: NodeJS.ErrnoException | null) => {
              if (err) {
                console.error("err:", err);
              } else {
                console.log("Done");
              }
            }
          );
        });
    });
  }

  questions(): Question<Answers>[] {
    return [
      {
        type: "input",
        name: "input",
        message: "What is the name of the webcomponent?",
      },
    ];
  }
}
