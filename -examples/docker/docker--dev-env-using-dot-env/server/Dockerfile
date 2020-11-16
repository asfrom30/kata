FROM node:10

RUN  mkdir -p /srv/app/fr-shohin-admin-server
WORKDIR /srv/app/fr-shohin-admin-server

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

CMD [ "npm", "run", "dev" ]
