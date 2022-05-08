import { SmileOutlined, AccountBookFilled, PayCircleOutlined,
   HistoryOutlined, HeartOutlined, UserOutlined,WalletOutlined,
  ScheduleOutlined, ProfileOutlined } from '@ant-design/icons';

const asideMenuConfig = [
  {
    name: '教师列表',
    path: '/home/main',
    icon: ProfileOutlined,
  },
  {
    name: '预订课程',
    path: '/home/bookedLessons',
    icon: ScheduleOutlined,
  },
  {
    name: '历史课程',
    path: '/home/historyLessons',
    icon: HistoryOutlined,
  },
  {
    name: '钱包',
    path: '/home/wallet',
    icon: WalletOutlined,
  },
  {
    name: '充值',
    path: '/home/topup',
    icon: PayCircleOutlined,
  },
  {
    name: '账号',
    path: '/home/account',
    icon: UserOutlined,
  },
];

export { asideMenuConfig };
