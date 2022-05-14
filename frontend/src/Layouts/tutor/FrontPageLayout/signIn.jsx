import { Button, Dialog } from '@alifd/next';
import React from 'react';
import LoginBlock from '@/pages/tutor/Login/LoginBlock';

// eslint-disable-next-line @iceworks/best-practices/recommend-functional-component
class SignIn extends React.Component {
  state = {
    visible: false,
  };

  onOpen = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = (e) => {
    console.log(e.triggerType);
    this.setState({
      visible: false,
    });
  };

  render() {
    return (
      <div style={{ display: 'inline-block' }}>
        <Button onClick={this.onOpen} type="primary">
          Login In
        </Button>
        <Dialog
          v2
          title="Login In"
          visible={this.state.visible}
          onOk={this.onClose}
          onClose={this.onClose}
          closeMode={['close', 'esc']}
          footerActions={[]}
          hasMask
        >
          <div className="Login-page">
            <LoginBlock />
          </div>
        </Dialog>
      </div>
    );
  }
}

export default SignIn;
