FROM node:18.11.0 AS development

# Create app directory
WORKDIR /home/ubuntu/pms/pms_notification_service

COPY package*.json ./

RUN npm install glob rimraf

RUN npm install

#RUN npm install --only=development

COPY . .

RUN npm run build

FROM node:18.11.0 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /home/ubuntu/pms/pms_notification_service

COPY package*.json ./

RUN npm install

#RUN npm install --only=production

COPY . .


COPY --from=development /home/ubuntu/pms/pms_notification_service/dist ./dist

CMD ["node", "dist/main"]