import React, { Component } from "react";
import { Container } from "reactstrap";
import { NavMenu } from "./NavMenu";
import { Typography } from "antd";
const { Text } = Typography;

export class Layout extends Component {
	static displayName = Layout.name;

	render() {
		return (
			<div>
				<NavMenu />
				<Container tag="main">{this.props.children}</Container>
				<footer>
					<Text type="secondary"> ©️ Colour Code - 2023</Text>
				</footer>
			</div>
		);
	}
}
