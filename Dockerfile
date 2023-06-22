FROM node:14
# RUN apk update && apk upgrade &&     apk add --no-cache git
ENV PORT 80
# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN node --max-old-space-size=8192
# Installing dependencies
COPY package*.json /usr/src/app/
RUN npm install
# Copying source files
COPY . /usr/src/app

ENV NODE_ENV production
# Building app
RUN npm run build


RUN npm cache clean --force
# Running the app
CMD [ "npm", "start" ]
