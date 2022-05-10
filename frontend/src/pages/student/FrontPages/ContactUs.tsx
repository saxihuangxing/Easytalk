import { Row, Col, Divider } from 'antd';

 function ContactUs(){
    return(
        <div>
            <Row justify="center" align="middle"  >
                <Col style={{ paddingTop:'50px', height: "200px", lineHeight: "30px", color:'blue',fontSize:'20px',fontWeight:'bold' }}>
                    邮件： 1229958344@qq.com <br/>
                    助教微信：<br/>
                      1:  13145820493 <br/>
                      2:  becca_31 <br/>
                </Col>
            </Row>
        </div>
    )
}

export default ContactUs();