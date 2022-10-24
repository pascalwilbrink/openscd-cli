import { Question } from "inquirer";

export abstract class BaseCommand<T> {
  abstract description(): string;
  abstract command(): string;

  abstract alias(): string;

  abstract action(value: T): void;

  abstract questions(): Question[];
}
