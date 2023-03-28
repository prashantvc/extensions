import { DownloadOutlined, DownOutlined } from "@ant-design/icons";
import { Button, Dropdown, MenuProps } from "antd";
import { useEffect, useState } from "react";
import { ExtensionWrapper } from "../../data/package";

export const DownloadButton = ({ item }: { item: ExtensionWrapper }) => {
    const [targets, setTargets] = useState<string[]>([]);
    useEffect(() => {
        async function fetchData() {
            const targets = await getExtensionDetails(
                item.extension.identifier,
                item.extension.version);
            console.log(targets.length);
            setTargets(targets);
        }
        fetchData();
    }, [item]);

    const items: MenuProps['items'] = targets.map((t) => {
        return {
            key: t,
            label: t,
        }
    });

    if (targets.length <= 1) {
        return (
            <Button size="small" type="primary" href={item.packagePath}>Download <DownloadOutlined /></Button>
        );
    } else {
        return (
            <Dropdown.Button
                type="primary"
                size="small"
                icon={<DownOutlined />}
                title="Versions" menu={{
                    items,
                    selectable: true,
                }}>Download</Dropdown.Button>
        );
    }
}

async function getExtensionDetails(identifier: string | undefined,
    version: string | undefined) {
    const response = await fetch(`extension/targets/${identifier}/${version}`);
    const data: string[] = await response.json();
    return data;
}