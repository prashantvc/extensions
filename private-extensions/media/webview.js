"use strict";
const vscode = acquireVsCodeApi();

window.addEventListener("load", main);
function main() {
	const installButton = document.getElementById("installButton");
	installButton.addEventListener("click", installButtonClick);

	const markdownDiv = document.getElementById("markdownDiv");
	const markdownPath = markdownDiv.getAttribute("data-markdown-path");

	console.log("markdownPath: ", markdownPath);

	fetch(markdownPath)
		.then((response) => response.text())
		.then((data) => {
			const md = window.markdownit({
				html: true,
				linkify: true,
				typographer: true,
			});
			const html = md.render(data);
			const markdown = document.getElementById("markdownDiv");
			markdown.innerHTML = html;
		});
}

/**
 * @param {MouseEvent} event
 */
function installButtonClick(event) {
	const id = event.target.getAttribute("data-extension");
	console.log("installButtonClick: ", id);
	vscode.postMessage({
		command: "install",
		text: `intall ${id}`,
	});
}
