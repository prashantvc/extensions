#! /usr/bin/env node

import { Command } from "commander";
const figlet = require("figlet");

const pkg = require("../package.json");
const program = new Command();

program.name(pkg.name).description(pkg.description).version(pkg.version);

program.command("figlet").argument("<text>", "Text to display").description("Show figlet").action(showFiglet);

program.parse(process.argv);

const options = program.opts();

if (options.figlet) {
	showFiglet();
}

async function showFiglet(text: string = "Extensions") {
	const txt = await figlet.textSync(text, {
		font: "Standard",
		horizontalLayout: "default",
		verticalLayout: "default",
	});
	console.log(txt);
}
