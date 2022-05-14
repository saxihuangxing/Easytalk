import { Nav } from '@alifd/next';
import styles from './index.module.css';
import SignIn from './signIn';
import Aplly from './aplly';
const { Item } = Nav;
const header = <span className={styles.fusion}>Fun Talk</span>;
const footer = <a> <SignIn /> <Aplly /> </a>;
import Home from '@/pages/tutor/FrontPage/Home';
import ContactUs from '@/pages/tutor/FrontPage/Contact';
import { useState } from 'react';

//const backgroundImage = require('../../images/bg.png');
const FrontpageLayout = ({ childrens, location }) => { 
  const [childComponent, setChildrenComponent] = useState(Home);
  const onSelect = (selectedKeys: Array, item: Object, extra: Object) => {
    const key = selectedKeys[0];
    console.log(" key ==== " + key);
    if (key === 'home') {
      setChildrenComponent(Home);
    } else if (key === 'contactUs') {
      setChildrenComponent(ContactUs);
    }
  }
  return (
    <div>
      <Nav
        className="basic-nav"
        mode="popup"
        direction="hoz"
        type="primary"
        header={header}
        footer={footer}
        defaultSelectedKeys={["home"]}
        triggerType="hover"
        onSelect={ onSelect }
      >
        <Item key="home">Home</Item>
        <Item key="contactUs">Contact Us</Item>
      </Nav>
      <div className={styles.container}>{childComponent}</div>
    </div>
  );
}

/* const styles = {

};  */
export default FrontpageLayout;
