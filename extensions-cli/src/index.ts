#! /usr/bin/env node

import { Command } from "commander";
const figlet = require("figlet");

const pkg = require("../package.json");
const program = new Command();

program.name(pkg.name).description(pkg.description).version(pkg.version);

program
	.command("download")
	.argument("<identifier>", "Extension identifier")
	.description("Download extension from Visual Studio Marketplace")
	.option("-r, --recursive [value]", "Download all dependencies recursively", true)
	.action(downloadExtension);

program.parse(process.argv);

const options = program.opts();

async function downloadExtension(identifier: string, options: { recursive: boolean }) {
	console.log(options.recursive);
	console.log("Downloading extension: " + identifier);
}
