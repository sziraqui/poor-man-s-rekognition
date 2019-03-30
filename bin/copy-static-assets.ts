import * as shell from "shelljs";

shell.cp("-R", "web-demo", "dist/");
shell.cp("-R", "weights", "dist/");
