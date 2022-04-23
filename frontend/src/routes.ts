import { IRouterConfig, lazy } from 'ice';
import Layout from '@/Layouts/tutor/BasicLayout';
import StudentLayout from '@/Layouts/student/BasicLayout';
import FrontPageLayout from '@/Layouts/tutor/FrontPageLayout';
import Account from '@/pages/tutor/Account';
import StudentWelPage from '@/Layouts/student/FrontPageLayout';
import StudentMainPage from '@/pages/student/index';
import TutorProfile from '@/pages/student/TutorProfile';
import StuBookedLesson from '@/pages/student/BookedLesson';
import AdminLoginLayout from '@/Layouts/admin/UserLayout';
import AdminBasicLayout from '@/Layouts/admin/BasicLayout';
import AdminLogin from '@/pages/admin/UserLogin';
import TutorManage from '@/pages/admin/tutorManage';
import StudentManage from '@/pages/admin/studentManage';
const Dashboard = lazy(() => import('@/pages/tutor/Dashboard'));
const Schedule = lazy(() => import('@/pages/tutor/Schedule'));
const Home = lazy(() => import('@/pages/tutor/Home'));
const FrontPageHome = lazy(() => import('@/pages/tutor/FrontPage/Home'));
const Contact = lazy(() => import('@/pages/tutor/FrontPage/Contact'));
const NotFound = lazy(() => import('@/components/NotFound'));

const routerConfig: IRouterConfig[] = [
  {
    path: '/tutor',
    children:[
      {
        path: '/userInfo',
        component: Layout,
        children: [
          { path: '/', exact: true, component: Home },
          { path: '/dashboard', component: Dashboard },
          { path: '/schedule', component: Schedule },
          { path: '/account', component: Account },
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
          { path: '/', exact: true, component: TutorManage },
          { path: '/studentMange', exact:true, component: StudentManage},
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
          { path: '/main', component: StudentMainPage() },
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
