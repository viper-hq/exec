import { execSync, exec, ExecSyncOptions, ChildProcess } from "child_process";

export interface Exec {
  ([first, ...parts]: TemplateStringsArray, ...args: any[]): void;
  get([first, ...parts]: TemplateStringsArray, ...args: any[]): string;
  get(
    stdin: ExecSyncOptions["input"]
  ): ([first, ...parts]: TemplateStringsArray, ...args: any[]) => string;
  async([first, ...parts]: TemplateStringsArray, ...args: any[]): ChildProcess;
  pipe(
    input: any
  ): ([first, ...parts]: TemplateStringsArray, ...args: any[]) => void;
}

export default function constructor(
  shell = "/bin/bash",
  escape = (str: string) => str,
  opts: { [key: string]: any } = {}
): Exec {
  const template = (first: string, parts: string[], args: any[]) =>
    parts.reduce((text, part, i) => {
      text += escape(args[i]);
      text += part;
      return text;
    }, first);

  const root = (
    [first, ...parts]: TemplateStringsArray,
    ...args: any[]
  ): void => (
    execSync(template(first, parts, args), {
      shell,
      stdio: ["pipe", "inherit", "inherit"],
      ...opts
    }),
    undefined
  );

  root.get = (...args) => {
    const call = (input?) => ([first, ...parts], ...args) =>
      execSync(template(first, parts, args), {
        shell,
        stdio: ["pipe", "pipe", "ignore"],
        ...((input && { input }) || {}),
        ...opts
      }).toString();
    if (Array.isArray(args[0]) && args[0].every(e => typeof e === "string")) {
      return call().apply(null, args);
    }
    return call(args[0]);
  };

  root.async = (
    [first, ...parts]: TemplateStringsArray,
    ...args: any[]
  ): ChildProcess =>
    exec(template(first, parts, args), {
      shell,
      ...opts
    });

  root.pipe = input => (
    [first, ...parts]: TemplateStringsArray,
    ...args: any[]
  ): void => (
    execSync(template(first, parts, args), {
      shell,
      stdio: ["pipe", "inherit", "inherit"],
      input,
      ...opts
    }),
    undefined
  );

  return root;
}
