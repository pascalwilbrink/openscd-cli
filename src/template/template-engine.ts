import { readFile } from "fs";
import { compile, TemplateDelegate } from "handlebars";

export class TemplateEngine {
  public compileFile(path: string, model: any): Promise<string> {
    return new Promise((resolve, reject) => {
      readFile(
        path,
        {
          encoding: "utf-8",
        },
        (err: NodeJS.ErrnoException | null, data: string) => {
          if (err) {
            return reject(err);
          }

          const template: TemplateDelegate = compile(data);

          resolve(template(model));
        }
      );
    });
  }
}
