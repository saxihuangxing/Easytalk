import { IRouterConfig, lazy } from 'ice';
import Layout from '@/Layouts/tutor/BasicLayout';
import StudentLayout from '@/Layouts/student/BasicLayout';
import FrontPageLayout from '@/Layouts/tutor/FrontPageLayout';
import Account from '@/pages/tutor/Account';
import StudentWelPage from '@/Layouts/student/FrontPageLayout';
import StudentMainPage from '@/pages/student/index';
import TutorProfile from '@/pages/student/TutorProfile';
import StuBookedLesson from '@/pages/student/BookedLesson';
import StuHistoryLesson from '@/pages/student/HistoryLesson';
import StuTopup from '@/pages/student/TopUp';
import StuWallet from '@/pages/student/Wallet';
import StuAccount from '@/pages/student/Account';
import AdminLoginLayout from '@/Layouts/admin/UserLayout';
import AdminBasicLayout from '@/Layouts/admin/BasicLayout';
import AdminLogin from '@/pages/admin/UserLogin';
import TutorManage from '@/pages/admin/tutorManage';
import StudentManage from '@/pages/admin/studentManage';
import AdminBookedLesson from '@/pages/admin/BookLesson';
import AdminHistoryLesson from '@/pages/admin/HistoryLesson';
import AdminTopupApply from '@/pages/admin/TopupManange';
import AdminTopupApplyHistory from '@/pages/admin/topupApplyHistory';
const AdminTutorDetails = lazy(() => import('@/pages/admin/TutorDetails'));
const AdminStudentDetails = lazy(() => import('@/pages/admin/studentDetails'));
const Schedule = lazy(() => import('@/pages/tutor/Schedule'));
const TutorBookedLesson = lazy(() => import('@/pages/tutor/BookedLesson'));
const TutorHistoryLesson = lazy(() => import('@/pages/tutor/HistoryLesson'));
const FrontPageHome = lazy(() => import('@/pages/tutor/FrontPage/Home'));
const Contact = lazy(() => import('@/pages/tutor/FrontPage/Contact'));
const NotFound = lazy(() => import('@/components/NotFound'));
const LessonDetails = lazy(() => import('@/components/LessonDetails'));

const routerConfig: IRouterConfig[] = [
  {
    path: '/tutor',
    children:[
      {
        path: '/home',
        component: Layout,
        children: [
          { path: '/account', exact: true, component: Account },
          { path: '/bookedLessons', component: TutorBookedLesson },
          { path: '/historyLessons', component: TutorHistoryLesson },
          { path: '/schedule', component: Schedule },
          { path: '/lessonDetails', component: LessonDetails },
          { component: NotFound },
        ],
      },
      {
        path: '/',
        component: FrontPageLayout,
        children: [
           { path: '/contact', component: Contact },
          { path: '/', component: FrontPageHome },
        ],
      },
    ]
  },
  {
    path: '/admin',
    children: [
      {
        path: '/home',
        component: AdminBasicLayout,
        children: [
          { path: '/tutorManage', exact: true, component: TutorManage },
          { path: '/studentMange', exact:true, component: StudentManage },
          { path: '/bookedLesson', exact: true, component: AdminBookedLesson },
          { path: '/historyLesson', exact:true, component: AdminHistoryLesson },
          { path: '/topupApplyChecking', exact:true, component: AdminTopupApply} ,
          { path: '/topupApplyHistory', exact:true, component: AdminTopupApplyHistory },
          { path: '/tutorDetail', exact:true, component: AdminTutorDetails },
          { path: '/studentDetail', exact:true, component: AdminStudentDetails },
          { path: '/lessonDetails', component: LessonDetails },   
        ]
      },
      {
        path: '/',
        component: AdminLoginLayout,
        children: [
          { path: '/', exact: true, component: AdminLogin },
        ]
      }
    ],
  },
  {
    path: '/',                                  //student
    children:[
      {
        path: '/home',
        component: StudentLayout,
        children: [
          { path: '/tutorDetail', component: TutorProfile },  
          { path: '/bookedLessons', component: StuBookedLesson },
          { path: '/historyLessons', component: StuHistoryLesson },
          { path: '/topup', component: StuTopup },
          { path: '/wallet', component: StuWallet },
          { path: '/account', component: StuAccount },
          { path: '/main', component: StudentMainPage() },
          { path: '/lessonDetails', component: LessonDetails }
        ],
      },
      {
        path: '/',
        component: StudentWelPage,
        children: [
          { path: '/contact', component: Contact },
          { path: '/', component: FrontPageHome },
        ],
      },
    ]
  }
];

export default routerConfig;
