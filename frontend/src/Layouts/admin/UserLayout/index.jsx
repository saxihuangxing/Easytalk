import { Grid } from '@alifd/next';
import Footer from './components/Footer';
import Intro from './components/Intro';
import Layout from "@icedesign/layout";
const { Row, Col } = Grid;
const UserLayout = (props) => {
    return (
      <div style={styles.container}>
        <div style={styles.mask} />
        <Row wrap style={styles.row}>
          <Col l="12">
            <Intro />
          </Col>
          <Col l="12">
            <div style={styles.form}>
            {props.children}
{/*               <Layout.Main>
                {props.children}
              </Layout.Main> */}
            </div>
          </Col>
        </Row>
        <Footer />
      </div>
    );
}

const styles = {
  container: {
    position: 'relative',
    width: '100wh',
    minWidth: '1200px',
    height: '100vh',
    backgroundImage:`url(bg.png)`,
    backgroundSize: '100% 100%',
    display: 'flex',
    flexDirection: 'column',
  },
  mask: {
    position: 'absolute',
    left: '0',
    right: '0',
    top: '0',
    bottom: '0',
    background: '#000',
    opacity: '0.4',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: '1',
  },
  form: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};
export default UserLayout;
