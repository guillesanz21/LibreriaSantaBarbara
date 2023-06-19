FROM node:18.16.0-alpine

RUN apk add --no-cache bash
RUN npm i -g @nestjs/cli typescript ts-node

# Copy package.json and package-lock.json and install dependencies
COPY package*.json /tmp/app/
RUN cd /tmp/app && npm install

# Copy the rest of the application and move the recently installed node_modules to the app folder
COPY . /usr/src/app
RUN cp -a /tmp/app/node_modules /usr/src/app

# Copy the startup scripts
COPY ./wait-for-it.sh /opt/wait-for-it.sh
COPY ./startup.development.sh /opt/startup.development.sh
COPY ./startup.test.sh /opt/startup.test.sh

# Remove the carriage return from the scripts
RUN sed -i 's/\r//g' /opt/wait-for-it.sh
RUN sed -i 's/\r//g' /opt/startup.development.sh
RUN sed -i 's/\r//g' /opt/startup.test.sh


WORKDIR /usr/src/app
# RUN npm run build

CMD ["/opt/startup.development.sh"]
