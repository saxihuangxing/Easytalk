import { Nav } from '@alifd/next';
import styles from './index.module.css';
import SignIn from './signIn';
import Aplly from './aplly';
import Home from '@/pages/student/FrontPages/HomePage';
import ContactUs from '@/pages/student/FrontPages/ContactUs';
import TutorQuality from '@/pages/student/FrontPages/tutorQuality';
import LessonSystem from '@/pages/student/FrontPages/LessonSystem';
import { useState } from 'react';
const { Item } = Nav;
const header = <span className={styles.fusion}>Fun Talk</span>;
const footer = <a> <SignIn /> <Aplly /> </a>;


const FrontpageLayout = ({ }) => {
  const [childComponent, setChildrenComponent] = useState(Home);
  const onSelect = (selectedKeys: Array, item: Object, extra: Object) => {
    const key = selectedKeys[0];
    console.log(" key ==== " + key);
    if (key === 'home') {
      setChildrenComponent(Home);
    } else if (key === 'lessonSystem') {
      setChildrenComponent(LessonSystem);
    } else if (key === 'tutorAbility') {
      setChildrenComponent(TutorQuality);
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
        onSelect={onSelect}
        defaultSelectedKeys={["home"]}
        triggerType="hover"
      >
        <Item key="home">首页</Item>
        <Item key="lessonSystem">教学体系</Item>
        <Item key="tutorAbility">师资力量</Item>
        <Item key="contactUs">联系我们</Item>
      </Nav>
      <div className={styles.container}>
       {/*  <div style={myStyles.mask}> */}
          {childComponent}
        {/* </div> */}
      </div>
    </div>
  );
}

const myStyles = {
  mask: {
    position: 'absolute',
    left: '0',
    right: '0',
    top: '0',
    bottom: '0',
    background: '#000',
    opacity: '0.4',
  }
};

/* const styles = {

};  */
export default FrontpageLayout;
