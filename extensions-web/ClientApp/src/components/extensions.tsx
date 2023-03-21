import { Avatar, Badge, List, Space } from "antd";
import React from "react";
import type { UploadProps } from 'antd';
import { Button, message, Upload, Typography } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Extension } from "../data/extension";
import { UploadChangeParam } from "antd/es/upload/interface";

const { Text } = Typography;

export class Extensions extends React.Component<
    {},
    {
        extensions: Extension[];
        loading: boolean;
    }
> {

    onChange(info: UploadChangeParam) {
        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
            this.populateExtensions();
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    }

    constructor(props: any) {
        super(props);
        this.state = { extensions: [], loading: true };
    }

    public render() {
        return (
            <div>
                <Upload name="file" action="extension" onChange={this.onChange}>
                    <Button icon={<UploadOutlined />}>Upload Extension</Button>
                </Upload>
                <br />
                <List itemLayout="horizontal"
                    dataSource={this.state.extensions}
                    renderItem={(item, index) => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={
                                    <Avatar shape="square" size="large" src={`output/${item.identifier}-${item.version}/${item.icon}`}/>
                                }
                                title={
                                    <Space>
                                        {item.displayName}
                                        <Text type="secondary">{item.identifier}</Text>
                                        <Badge
                                            className="site-badge-count-109"
                                            count={item.version}
                                            style={{ backgroundColor: '#52c41a' }}
                                        />
                                    </Space>

                                }
                                description={item.description}
                            />
                        </List.Item>
                    )}
                />
            </div>
        );
    }

    componentDidMount(): void {
        this.populateExtensions();
    }

    async populateExtensions() {
        console.log("Populating extensions");
        this.setState({ loading: true })

        const response = await fetch("extension");
        const extensionData: Extension[] = await response.json();

        this.setState({ extensions: extensionData, loading: false });
    }
}
