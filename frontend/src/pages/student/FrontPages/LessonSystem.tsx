import { Row, Col, Divider, Image } from 'antd';

 function lessonSystem(){
    return(
        <div>
            <Row justify="center">
                <Col span='16' style={{ paddingTop:'50px', height: "150px", lineHeight: "30px" ,color:'blue',fontSize:'16px',fontWeight:'bold' }}>
                        我们制定清晰的学习路径，将英语学习过程划分为相应的级别，编定了循序渐进的教材，每个级别完整对标欧洲CEFR级别、托福、雅思、托业等国际通用的英语级别体系与测试，
                        帮助学员清晰定位自己的语言水平，量化成长进程。
                </Col>
            </Row>
            <Row justify="center" align="middle"  >
                <Col style={{ height: "70px", lineHeight: "70px" }}>
                   <Image src='level.webp' />
                </Col>
            </Row>
        </div>    
    )
}

export default lessonSystem();