import { Command } from "commander";
import path from "path";
import * as fs from "fs";
import * as url from "url";
import axios from "axios";

export const extensionCommand = new Command("extension");
const FormData = require("form-data");

extensionCommand
	.command("add")
	.description("Upload an extension to a private extension repository")
	.argument("file", "The extension file to upload")
	.argument("url", "A valid private extension repository URL")
	.action(addExtension);

function addExtension(file: string, urlString: string) {
	const filePath = file.replace("~", process.env.HOME!);
	if (!fs.existsSync(filePath)) {
		console.error(`File '${filePath}' does not exist.`);
		return;
	}

	const parsedUrl = url.parse(urlString);
	if (!parsedUrl.protocol || !parsedUrl.hostname) {
		console.log(`${urlString} is invalid, please provide a valid URL with protocol and hostname.`);
		return;
	}

	urlString = `${url.format(parsedUrl)}extension`;
	uploadFile(filePath, urlString);
}

async function uploadFile(file: string, urlString: string) {
	let data = new FormData();
	let fstream = fs.createReadStream(file);
	data.append("file", file);

	let config = {
		method: "post",
		maxBodyLength: Infinity,
		url: urlString,
		data: data,
		headers: {
			...data.getHeaders(),
		},
	};

	axios
		.request(config)
		.then((response) => {
			console.log(response.data);
		})
		.catch((error) => {
			console.log(error);
		});
}
