 const Constant = {
    APPLY_STATUS:{
        CHECKING: 'checking',
        APPROVED: 'approved',
    },
    TUTOR_STATUS:{
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
    ROLE:{
        TUTOR:'tutor',
        STUDENT:'student',
        ADMIN:'admin'
    },
    LESSON_TYPE:{
        BOOK: 'book',
        SUDDEN: 'sudden'
    },
    LESSON_STATUS:{
        WAITING: 'waiting',
        TAKING: 'taking',
        CANCELED: 'canceled',
        FINISHED: 'finished',
        DISPUTE: 'dispute',
        REFUND: 'refund',
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
    }, 
    walletTransReason:{
        topup:"Top Up",
        bookLesson: "Book Lesson",
        gift: "Gift",
        admindOperate: "admin Operate",
        cancelLesson: "Cancel Lesson",
        applyRefund: "Apply Refund",
    }
}

export default Constant; 