# PREPARE EVIREMENT NODEJS, VERSION node18/alpine
FROM node:18-alpine

# PLACE SAVE SOURCE CODE
WORKDIR /genealogy/backend

# A wildcard is used to ensure both package.json AND package-lock.json are copied 
COPY package*.json ./

RUN npm install

# COPY app source
COPY . .

# BUILD SOURCE CODE
RUN npm run build-src

CMD [ "npm", "run" , "build" ]

# docker build --tag genealogy-docker .
# docker run -p 3000:3000 -d genealogy-docker