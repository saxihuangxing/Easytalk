import './nav.css'
import { Nav } from '@alifd/next';
const { Item, SubNav } = Nav;
const header = <span className="fusion">FUSION</span>;
const footer = (
  <a className="login-in" href="javascript:;">
    Login in
  </a>
);

export default function Test() {
return (
  <Nav
    className="basic-nav"
    mode="popup"
    direction="hoz"
    type="primary"
    header={header}
    footer={footer}
    defaultSelectedKeys={["home"]}
    triggerType="hover"
  >
    <Item key="home">Home</Item>
    <Item key="Contact">Contact Us</Item>
  </Nav>
)
}