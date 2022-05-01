import { runApp, IAppConfig } from 'ice';
import '@/utils/HttpConfig';
import  './service/systemConfig';
const appConfig: IAppConfig = {
  app: {
    rootId: 'ice-container',
  },
  router: {
    type: 'hash',
  },
};


runApp(appConfig);
