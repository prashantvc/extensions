import { Divider, Dropdown, MenuProps, Space, Typography } from "antd";
import { Fragment, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IExtension } from "../data/extension";
import { ExtensionPackage } from "../data/extensionPackage";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import { PackageList } from "./packageList";

const { Text } = Typography;

const DetailsPage = () => {
	const { identifier, version } = useParams<{
		identifier: string;
		version: string;
	}>();
	const [uniqueVersions, setUniqueVersions] = useState<string[]>([]);
	const [selectedVeresion, setSelectedVersion] = useState<string>(version ?? "");
	const [readme, setReadme] = useState("");
	const [extensionPackage, setExtensionPackage] = useState<ExtensionPackage | undefined>(undefined);

	const navigate = useNavigate();

	useEffect(() => {
		async function fetchData() {
			try {
				const packageDetails = await getExtensionDetails(identifier, version);

				if (!version) {
					navigate(`/details/${identifier}/${packageDetails.version}`);
				}

				setExtensionPackage(packageDetails);
				setUniqueVersions(packageDetails.uniqueVersions);
				if (version !== undefined) {
					const response = await fetch(packageDetails.extention(version)?.readmePath ?? "");
					const fileContent = await response.text();
					setReadme(fileContent);
				}
			} catch (error) {
				console.error(error);
			}
		}
		fetchData();
	}, [identifier, version, navigate]);

	//get unique values
	const items: MenuProps["items"] = uniqueVersions.map((v) => {
		return {
			key: v,
			label: `v${v}`,
		};
	});

	const onClick: MenuProps["onClick"] = ({ key }) => {
		if (key === selectedVeresion) {
			return;
		}
		setSelectedVersion(key);
		navigate(`/details/${identifier}/${key}`);
	};

	return (
		<Fragment>
			<PackageList datasource={extensionPackage ? [extensionPackage] : []} version={version} />
			<Divider />
			<Space direction="horizontal">
				<Text>Version(s):</Text>
				<Dropdown.Button
					title="Versions"
					menu={{
						items,
						selectable: true,
						defaultSelectedKeys: [version!],
						onClick,
					}}
				>
					v{version}
				</Dropdown.Button>
			</Space>
			<Divider />
			<div className="markdown-body">
				<ReactMarkdown children={readme} remarkPlugins={[remarkGfm]} skipHtml={true} />
			</div>
		</Fragment>
	);
};

async function getExtensionDetails(identifier: string | undefined, version: string | undefined) {
	const response = await fetch(`extension/${identifier}/${version}`);
	const data: IExtension[] = await response.json();
	return new ExtensionPackage(identifier!, version!, data);
}

export default DetailsPage;
