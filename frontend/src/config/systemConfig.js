const systemConfig = {
    "lessonPrice" : 100,
    "coinRate": 5,
    "oneClassTime": 25,
    "cancelLessonlimitTime": 10,
    "cancelLessonRules": 
        [
            {
                "time": 180,
                "refundRate" : 1
            },
            {
                "time": 60, 
                "refundRate": 0.5 
            },
            {
                "time": 10, 
                "refundRate": 0.3 
            }
           
        ],
    "discountRules":
        [
            {
                "lessonAmount": 100,
                "discount": 0.15
            },
            {
                "lessonAmount": 50,
                "discount": 0.1
            },
            {
                "lessonAmount": 30,
                "discount": 0.08
            },
            {
                "lessonAmount": 10,
                "discount": 0.05
            }
        ],
        "walletInitCoin":0       
}

export default systemConfig; 