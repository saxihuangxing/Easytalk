import { Button, Dialog } from '@alifd/next';
import React from 'react';
import ResisterBlock from '@/pages/student/Login/ResisterBlock';

// eslint-disable-next-line @iceworks/best-practices/recommend-functional-component
class Aplly extends React.Component {
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
        <Button onClick={this.onOpen} type="secondary">
          注册
        </Button>
        <Dialog
          v2
          title=""
          visible={this.state.visible}
          onOk={this.onClose}
          onClose={this.onClose}
          closeMode={['close', 'esc']}
          hasMask
          footerActions={[]}
        >
          <div className="Register-page">
            <ResisterBlock />
          </div>
        </Dialog>
      </div>
    );
  }
}

export default Aplly;
