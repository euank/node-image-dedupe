FROM node:0.10

RUN apt-get update
RUN apt-get -y install libopenimageio-dev node-gyp
WORKDIR /app/
COPY package.json /app/package.json
RUN npm install
COPY . /app/
RUN mkdir imgs
VOLUME ["/app/public","/app/imgs"]

CMD ["node", "app.js"]
