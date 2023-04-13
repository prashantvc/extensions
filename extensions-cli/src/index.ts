#! /usr/bin/env node

import { Command } from "commander";
import { showExtension } from "./showExtension";
import { downloadExtensionById } from "./downloadExtension";
import { repoCommand } from "./repoCommands";

const pkg = require("../package.json");
const program = new Command();

program.name(pkg.name).description(pkg.description).version(pkg.version);

program
	.command("download")
	.argument("<identifier>", "Extension identifier")
	.description("Download extension from Visual Studio Marketplace")
	.option("-v, --version <value>", "Version to download (default: latest)")
	.option("-r, --recursive [value]", "Download all dependencies recursively", true)
	.action(downloadExtensionById);

program
	.command("show")
	.argument("<identifier>", "Extension identifier")
	.description("Show extension details from Visual Studio Marketplace")
	.action(showExtension);

program.addCommand(repoCommand);

program.parse(process.argv);
