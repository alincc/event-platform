FROM node:12-alpine as builder

# Create app directory
RUN mkdir -p /usr/src/webapp
WORKDIR /usr/src/webapp

ARG FONTAWESOME_NPM_AUTH_TOKEN
ENV FONTAWESOME_NPM_AUTH_TOKEN=$FONTAWESOME_NPM_AUTH_TOKEN

ADD package.json /tmp/package.json
ADD .npmrc /tmp/.npmrc
RUN cd /tmp && npm install
RUN cp -a /tmp/node_modules /usr/src/webapp

# Bundle app source
ADD . /usr/src/webapp
RUN npm run build:prod

CMD ["npm", "run", "server"]