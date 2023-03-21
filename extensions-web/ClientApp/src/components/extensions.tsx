import { Avatar, Badge, List, Space } from "antd";
import React from "react";
import type { UploadProps } from 'antd';
import { Button, message, Upload } from 'antd';
import { GithubOutlined, UploadOutlined } from '@ant-design/icons';

export class Extensions extends React.Component<
    {},
    {
        extensions: any[];
        loading: boolean;
    }
> {

    uploadProp: UploadProps = {
        name: 'file',
        action: 'extension',
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };

    constructor(props: any) {
        super(props);
        this.state = { extensions: [], loading: true };
    }

    public render() {
        return (
            <div>
                <Upload {...this.uploadProp}>
                    <Button icon={<UploadOutlined />}>Upload Extension</Button>
                </Upload>
                <br />
                <List itemLayout="horizontal"
                    dataSource={this.state.extensions}
                    renderItem={(item, index) => (
                        <List.Item
                            actions={[
                                <Space>
                                    <GithubOutlined />
                                </Space>
                            ]}
                        >
                            <List.Item.Meta
                                avatar={<Avatar shape="square" size="large" />}
                                title={
                                    <Space>
                                        
                                            {item.displayName}
                                        
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
        const response = await fetch("extension");
        const extensionData = await response.json();
        this.setState({ extensions: extensionData, loading: false });
    }
}