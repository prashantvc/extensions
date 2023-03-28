import { Avatar, List, Space, Tag, Typography } from "antd";
import { NavLink } from "react-router-dom";
import { Extension } from "../data/extension";
import { DownloadButton } from "./view/downloadButton";

const { Text } = Typography;

// package list FC component
export const PackageList = ({ datasource }: { datasource: Extension[] }) => {
    return (
        <List itemLayout="horizontal"
            dataSource={datasource}
            renderItem={(item, index) => (
                <List.Item
                    actions={[
                        <DownloadButton item={item} />
                    ]}>
                    <List.Item.Meta
                        avatar={
                            <Avatar shape="square" size={{ lg: 64, xl: 64, xxl: 64 }} src={item.iconPath} />
                        }
                        title={
                            <Space direction="vertical" size='small'>
                                <Space align="center">
                                    <NavLink to={`/details/${item.extension.identifier}/${item.extension.version}`}>
                                        {item.extension.displayName}
                                    </NavLink>
                                    <Tag>v{item.extension.version}</Tag>
                                </Space>
                                <Text type="secondary">{item.extension.identifier}</Text>
                            </Space>
                        }
                        description={item.extension.description}
                    />
                </List.Item>
            )}
        />
    );
}