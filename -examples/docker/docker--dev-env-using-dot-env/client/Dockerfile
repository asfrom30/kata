FROM node:10

RUN  mkdir -p /srv/app/fr-shohin-admin-client
WORKDIR /srv/app/fr-shohin-admin-client

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

CMD [ "npm", "start" ]

# docker run -it -p 8080:3000 -v /srv/app/fr-shohin-admin-client/node_modules -v $(pwd):/srv/app/fr-shohin-admin-client a416
