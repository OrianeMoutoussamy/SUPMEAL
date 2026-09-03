import http from 'http';
import { Server } from 'socket.io';
import { app } from './app';
import { env } from './config/env';
import { prisma } from './config/database';
import { configureSocket } from './sockets/socket';
const server=http.createServer(app);const io=new Server(server,{cors:{origin:env.frontendUrl,credentials:true}});configureSocket(io);
async function start(){await prisma.$connect();server.listen(env.port,()=>console.log(`SUPMEAL API disponible sur http://localhost:${env.port}`));}
async function shutdown(){await prisma.$disconnect();server.close(()=>process.exit(0));}
process.on('SIGTERM',shutdown);process.on('SIGINT',shutdown);start().catch((e)=>{console.error('Impossible de démarrer le serveur :',e);process.exit(1);});
