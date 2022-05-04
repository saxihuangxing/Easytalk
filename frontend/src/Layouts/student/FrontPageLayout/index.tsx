import { Nav } from '@alifd/next';
import styles from './index.module.css';
import SignIn from './signIn';
import Aplly from './aplly';
const { Item } = Nav;
const header = <span className={styles.fusion}>Easy Talk</span>;
const footer = <a> <SignIn /> <Aplly /> </a>;

const FrontpageLayout = ({ childrens, location }) => {
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
      >
        <Item key="home">Home</Item>
      </Nav>
      <div className={styles.container}>{childrens}</div>
    </div>
  );
}

/* const styles = {

};  */
export default FrontpageLayout;
