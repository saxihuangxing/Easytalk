import { Row, Col, Divider } from 'antd';

 function tutorQuality(){
    return(
        <div>
            <Row justify="center" >
                <Col span='16' style={{ paddingTop:'50px', height: "150px", lineHeight: "30px" ,color:'blue',fontSize:'16px',fontWeight:'bold' }}>
                        所有教师必须拥有本科级及以上文凭并且拥有 TEFL/TESOL 国际英语老师资格证书。
                        我们对外教老师的筛选非常严格，均来自其他知名机构拥有教学经验的老师，由于目前外教市场
                        师资良莠不齐，我们给予给高的薪资吸引更优秀的老师，实向优中择优a。
                </Col>
            </Row>
        </div>
    )
}

export default tutorQuality();