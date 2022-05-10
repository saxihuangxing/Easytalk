import { Row, Col, Divider } from 'antd';
import { Card } from '@alifd/next';

function Home() {
    return (
        <div>
            <Row justify="center" align="middle"  >
                <Col style={{ height: "70px", lineHeight: "70px" }}>
                    <label style={{ color:'#1f2633',fontSize:'48px',fontWeight:'bold' }}> 线上外教一对一英语教学 </label>
                </Col>
            </Row>
            <Row justify="center" align="middle"  >
                <Col style={{ height: "70px", lineHeight: "70px" }}>
                    <label style={{ color:'black',fontSize:'32px',fontWeight:'bold' }}> 选择我们的理由 </label>
                </Col>
            </Row>
            <Row justify="space-around" align="middle"  >
                <Col style={{ height: "250px", lineHeight: "250px" }}>
                    <Card hasBorder free style={{ width: 500 }}>
                    <Card.Header title="高性价比"  />
                    <Card.Content>
                        对比市面上其他机构，我们保持更低的价格但是提供更优质的服务。师资力量是教学质量最关键的因素，我们会将大部分
                        资金投入到聘请老师中，提供优于其它机构的薪资，以保证能聘请到更优秀的外教老师。我们不追求利润和扩大规模，
                        只希望维持一个小社区提供低价但是优质的教学质量，做英语教育界的小米。
                    </Card.Content>
                    </Card>
                </Col>
                <Col style={{ height: "250px", lineHeight: "250px" }}>
                    <Card hasBorder free style={{ width: 500 }}>
                    <Card.Header title="课程灵活"  />
                    <Card.Content>
                        可以自由选择老师和上课时间，预订课程只需要提前小一时即可。针对大部分上班族时间繁忙，比较难确定上课时间，我们支持
                        只提前一小时预定即可，也可以直接通过私信管理员马上上课。后续会在网站中增加即时课程功能，立即上课。
                    </Card.Content>
                    </Card>
                </Col>
            </Row>
            <Row justify="space-around" align="middle" style={{ marginTop: '20px' }}  >
                <Col style={{ height: "250px", lineHeight: "250px" }}>
                    <Card hasBorder free style={{ width: 500 }}>
                    <Card.Header title="全程服务"  />
                    <Card.Content>
                        一但注册我们平台，会有助教全程为您服务，为您解答任何的疑问，英语水平测评，课程安排，学习进度跟踪。
                        为您的学习保驾护航，保证您的学习效果。
                    </Card.Content>
                    </Card>
                </Col>
                <Col style={{ height: "250px", lineHeight: "250px" }}>
                    <Card hasBorder free style={{ width: 500 }}>
                    <Card.Header title="有趣的课堂"  />
                    <Card.Content>
                        "learn english have to be fun",我们的教学理念是一定要把学习英语变成一件快乐的事情，我们会因材施教，
                        找到适合每个学生学习的方法，激发学员学习英语的兴趣，让学习英语变成一件快乐的事情。
                    </Card.Content>
                    </Card>
                </Col>                
            </Row>


        </div>
    )
}

export default Home();