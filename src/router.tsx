import { createBrowserRouter } from 'react-router-dom';
import SsloHome from './components/sslo/SsloHome';
import Root from './screens/Root';
import SsloMain from './screens/sslo';
import Login from './screens/auth/login/main';
import Signup from './screens/auth/signup/main';
import SignupWait from './screens/auth/signup/wait';
import SignupMail from './screens/auth/signup/mail';
import SignupFailTimeout from './screens/auth/signup/fail_timeout';
import SignupComplete from './screens/auth/signup/complete';
import SignupFailOK from './screens/auth/signup/fail_ok';
import LoginFailMail from './screens/auth/login/fail_mail';
import LoginFailMailComplete from './screens/auth/login/fail_mail_complete';
import FindIdMain from './screens/auth/find/id_main';
import FindIdMail from './screens/auth/find/id_mail';
import CoreRoot from './screens/core/CoreRoot';
import AllProject from './screens/core/project/all';
import ProjectCreate from './screens/core/project/create';
import ProjectDetail from './screens/core/project/detail';
import StudioRoot from './screens/studio/Root';
import PreProcessing from './screens/studio/preprocessing';
import Labeling from './screens/studio/labeling';
import CollectInspection from './screens/studio/CollectInspection';

const router = createBrowserRouter([
  {
    path: '/',
    element: <SsloHome />,
    children: [{ path: '', element: <SsloMain /> }],
  },
  {
    path: '/sslo',
    element: <SsloHome />,
    children: [{ path: 'main', element: <SsloMain /> }],
  },
  {
    path: '/login',
    element: <Root />,
    children: [
      { path: '', element: <Login /> },
      { path: 'fail/mail', element: <LoginFailMail /> },
      { path: 'fail/mail/complete', element: <LoginFailMailComplete /> },
    ],
  },
  {
    path: '/signup',
    element: <Root />,
    children: [
      { path: '', element: <Signup /> },
      { path: 'wait', element: <SignupWait /> },
      { path: 'mail', element: <SignupMail /> },
      { path: 'fail/timeout', element: <SignupFailTimeout /> },
      { path: 'complete', element: <SignupComplete /> },
      { path: 'fail/ok', element: <SignupFailOK /> },
    ],
  },
  {
    path: '/find',
    element: <Root />,
    children: [
      { path: 'id', element: <FindIdMain /> },
      { path: 'id/mail', element: <FindIdMail /> },
    ],
  },
  {
    path: '/core',
    element: <CoreRoot />,
    children: [
      { path: 'projects', element: <AllProject /> },
      { path: 'projects/create', element: <ProjectCreate /> },
      { path: 'projects/:pId', element: <ProjectDetail /> },
    ],
  },
  {
    path: '/studio',
    element: <StudioRoot />,
    children: [
      { path: 'collect/:pId', element: <CollectInspection /> },
      { path: 'preprocessing/:pId', element: <PreProcessing /> },
      { path: 'labeling/:pId', element: <Labeling /> },
    ],
  },
]);
export default router;
