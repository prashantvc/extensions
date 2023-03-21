import { Button, Avatar, List } from "antd";
import React from "react";



export class Extensions extends React.Component<
    {},
    {
        extensions: any[];
        loading: boolean;
    }
> {
    constructor(props: any) {
        super(props);
        this.state = { extensions: [], loading: true };
    }

    public render() {
        return (
            <List itemLayout="horizontal"
                dataSource={this.state.extensions}
                renderItem={(item, index) => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar shape="square" size="large" src={`https://joesch.moe/api/v1/random?key=${index}`} />}
                            title={item.displayName}
                            description={item.description}
                        />
                    </List.Item>

                )}
            />
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
