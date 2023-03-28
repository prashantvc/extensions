import { Avatar, List, Space, Tag, Typography } from "antd";
import { NavLink } from "react-router-dom";
import { ExtensionPackage } from "../data/extensionPackage";
import { DownloadButton } from "./view/downloadButton";

const { Text } = Typography;

// package list FC component
export const PackageList = ({ datasource }: { datasource: ExtensionPackage[] | undefined }) => {

    return (
        <List itemLayout="horizontal"
            dataSource={datasource}
            renderItem={(item, index) => (
                <List.Item
                    actions={[
                        <DownloadButton extensions={item.extensions} />
                    ]}>
                    <List.Item.Meta
                        avatar={
                            <Avatar shape="square" size={{ lg: 64, xl: 64, xxl: 64 }} src={item.mainExtension.iconPath} />
                        }
                        title={
                            <Space direction="vertical" size='small'>
                                <Space align="center">
                                    <NavLink to={`/details/${item.identifier}/${item.version}`}>
                                        {item.mainExtension.extension.displayName}
                                    </NavLink>
                                    <Tag>v{item.version}</Tag>
                                </Space>
                                <Text type="secondary">{item.identifier}</Text>
                            </Space>
                        }
                        description={item.description}
                    />
                </List.Item>
            )}
        />
    );
}