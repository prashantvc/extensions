import React, { Component, Fragment } from "react";
import { Container } from "reactstrap";
import { NavMenu } from "./NavMenu";
import { Typography } from "antd";
const { Text } = Typography;

export class Layout extends Component {
	static displayName = Layout.name;

	render() {
		return (
			<Fragment>
				<NavMenu />
				<Container className="main" tag="main">
					{this.props.children}
				</Container>
				<footer>
					<div style={{ float: "left" }}>
						<Text type="secondary">©️ Color Code Technologies - 2023</Text>
					</div>
					<div style={{ float: "right" }}>
						<a href="mailto:contact@colorcodehq.com">
							<Text type="secondary">support</Text>
						</a>
					</div>
				</footer>
			</Fragment>
		);
	}
}
