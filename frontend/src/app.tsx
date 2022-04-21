import { runApp, IAppConfig } from 'ice';
import '@/utils/HttpConfig';
const appConfig: IAppConfig = {
  app: {
    rootId: 'ice-container',
  },
  router: {
    type: 'hash',
  },
};

runApp(appConfig);
