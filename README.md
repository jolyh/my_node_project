# my_node_project

Basic Node.js project using Express for routing.

## Run

```bash
npm install
npm start
```

or 

```bash
npm install
npm run nodemon
```

Kill port
netstat -ano | findstr :3000
taskkill /PID {id} /F


## Docker
https://www.youtube.com/watch?v=DQdB7wFEygo
https://www.coursera.org/collections/docker-cheat-sheet


individual container: 
backend: docker run -p 3000:3000 --name my-running-app my-node-app
frontend: docker run -p 5173:5173 --name my-app-frontend my-node-app

compore: docker-compose up --build

##Typescript

Node: npm install typescript ts-node @types/node --save-dev 
Express: npm install @types/express --save-dev    
Vue: npm install -D typescript vue-tsc @types/node @vue/tsconfig
Create tsconfig.json -> npx tsc --init