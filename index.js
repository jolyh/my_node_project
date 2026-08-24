import express from "express";
import { createServer } from "http";

import { rateLimit } from "express-rate-limit"; // https://www.npmjs.com/package/express-rate-limit
import helmet from 'helmet'; // https://www.npmjs.com/package/helmet
import cookieParser from 'cookie-parser';

import path from 'path';
import { fileURLToPath } from 'url';

// Import Database, Repositories, Services, Controllers
import dbInstance from './internal/database/dbInstance.js';
import mainRouterInit from "./internal/routers/router.js"
import repositories from './internal/repositories/repositories.js';
import services from './internal/services/services.js';
import controllers from './internal/controllers/controllers.js';
import Logger from './internal/utils/Logger.js';

//#region Database, Repositories, Services, Controllers
Logger.systemInfo(`Audit logs enabled: ${process.env.WITH_AUDIT_LOGS === 'true'}`);

await dbInstance.init();
Logger.systemInfo('Database connected successfully');

let repositoriesInstance = {};

repositoriesInstance = await repositories(dbInstance);
let servicesInstance = {};

servicesInstance = await services(dbInstance, repositoriesInstance);
Logger.init(servicesInstance.auditLogService);

let controllersInstance = {};
controllersInstance = await controllers(servicesInstance);

//#endregion

const app = express();
const PORT = process.env.PORT || 8080
const server = createServer(app);

// Serve static files from the "client" directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//#region Middleware
process.on('uncaughtException', (error) => {
  Logger.systemError('Critical uncaught exception', error);
  gracefulShutdown(1); 
});

process.on('unhandledRejection', (reason) => {
  Logger.systemError('Unhandled promise rejection', reason);
  gracefulShutdown(1);
});

// Handle termination signals from PM2, Docker, or Kubernetes
process.on('SIGTERM', () => {
  Logger.systemInfo('SIGTERM received. Starting graceful shutdown.');
  gracefulShutdown(0);
});

function gracefulShutdown(exitCode) {
  Logger.systemInfo('Closing active resources.');
  
  // Close your HTTP server so it stops accepting new connections
  if (server && server.close) {
    server.close(() => {
      Logger.systemInfo('Server closed. Exiting process.');
      process.exit(exitCode); // Exit with failure code
    });
  } else {
    process.exit(exitCode);
  }

  // Force exit after a timeout if cleanup hangs
  setTimeout(() => {
    Logger.systemError('Forced exit due to timeout.');
    process.exit(exitCode);
  }, 5000);
}

app.use(express.json()); // Parses application/json payloads
app.use(express.urlencoded({ extended: true })); // Parses form-submitted payloads
app.use(cookieParser())

//#region Security Middleware
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 100 requests per windowMs
  message: "You've reached the limit!",
  standardHeaders: 'draft-7', // Return rate limit info in headers
  legacyHeaders: false, // Disable the X-RateLimit-* headers
})
app.use(rateLimiter)

Logger.systemInfo('Security headers are enabled.');
Logger.systemInfo('Rate limiting is enabled: 100 requests per 15 minutes.');
//#region Header protection
app.use(helmet(
  {
    xDownloadOptions: true,
    contentSecurityPolicy: process.env.NODE_ENV === 'development' ? false :  {
      directives: {
        // Fallback for unspecified directives (trust only the domain's own origin)
        defaultSrc: ["'self'"],
        
        // Allow self-hosted scripts and response-specific inline scripts
        scriptSrc: [
          "'self'",
        ],

        styleSrc: ["'self'"],
        
        // Allow images from self and data URIs (e.g., base64 images)
        imgSrc: ["'self'", "data:"],
        
        // Block all objects like Flash or Java plugins
        objectSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: true,
  }
));
//#endregion

//#endregion

mainRouterInit(
  express,
  app, 
  controllersInstance,
  __dirname,
  () => gracefulShutdown(1)
)

//#endregion

//#region Start
server.listen(PORT, () => {
  Logger.systemInfo(`Server running on port ${PORT}`);
});
//#endregion

export default app;
