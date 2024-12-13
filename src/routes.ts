import express, { Application } from 'express';
import path from 'path';
import { healthRoutes } from '@portal/routes/health';
import { troubleshootRoutes } from '@portal/routes/troubleshoot';
import { deployRoutes } from '@portal/routes/enable-system';
import { networkRoutes } from '@portal/routes/network-settings';
import { apache } from '@portal/routes/apache';
import { ports } from '@portal/routes/ports';
import { config } from '@portal/routes/configuration';
import authenticateToken, { patnerAuthToken } from '@portal/utils/verify';


export const appRoutes = (app: Application) => {
  app.use('', healthRoutes.routes());
  app.use('/api',authenticateToken, troubleshootRoutes.routes());
  app.use('/api',patnerAuthToken, deployRoutes.routes());
  app.use('/api',authenticateToken, networkRoutes.routes());
  app.use('/api', authenticateToken,ports.routes());
  app.use('/api', patnerAuthToken,apache.routes());
  app.use('/api',patnerAuthToken, config.routes());


  app.use(express.static(path.join(__dirname,'..', 'public')));
  // app.use(BASE_PATH, authRoutes.routes());

  // app.use(BASE_PATH, authRoutes.routes());
};
