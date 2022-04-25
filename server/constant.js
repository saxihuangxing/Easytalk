const Constant = {
    APPLY_STATUS:{
        CHECKING: 'checking',
        APPROVED: 'approved',
    },
    ACCOUNT_STATUS:{
        ACTIVE: 'active',
        DEACTIVE: 'deactive',
    },
    RES_SUCCESS: 0,
    RES_FAILED: -1,
    ENROLL_FAIL_REASON:{
        EXIST_USERNAME: 0,
        WRONG_ROLE: 1,
        UNKNOWN: -1,
    },
    LESSON_TYPE:{
        BOOK: 'book',
        SUDDEN: 'sudden'
    },
    LESSON_STATUS:{
        WAITING: 'waiting',
        TAKING: 'taking',
        CANCELED: 'CANCELED',
        FINISHED: 'finished',
    },
    SCHEDULE_STATUS:{
        PASSED: -1,
        Default: 0,
        Available: 1,
        BOOKED: 2,
    },
    Book_FAIL_REASON:{
        UNKNOW: -1,
        DATA_INCOMPELETE: 0,
        TUTOR_UNAVAILABLE: 1,
        INSUFFIENT_COIN: 2,
    },
    CANCEL_LESSON_FAIL_REASON:{
        UNKNOW: -1,
        TimeTooClose: 0,
        LessonInfoError: 1,
    }
}

module.exports = Constant