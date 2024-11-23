FROM node:20

WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN npm ci

ENV DEBUG=todo-backend:*
# ENV MONGO_URL=mongodb://the_username:the_password@localhost:3456/the_database 
# ENV REDIS_URL=//localhost:6378

USER node

CMD ["npm", "start", "--", "--host"]