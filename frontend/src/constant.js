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
    ROLE:{
        TUTOR:'tutor',
        STUDENT:'student',
        ADMIN:'admin'
    },
    LESSON_TYPE:{
        BOOK: 'book',
        SUDDEN: 'sudden'
    },
    
}

export default Constant; 