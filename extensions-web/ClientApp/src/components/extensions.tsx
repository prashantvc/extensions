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
            <div>
                <h1>Extensions</h1>
                <p>Number of extensions {this.state.extensions.length}</p>
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
        console.log("Extensions: ", extensionData.length);
        this.setState({ extensions: extensionData, loading: false });
    }
}
