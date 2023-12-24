# Set the base image to Ubuntu
FROM ubuntu:20.04

#FOR DEBUGGING  
RUN apt-get update -y
RUN apt-get upgrade -y

# Install Node.js
RUN apt-get install --yes curl
RUN curl --silent --location https://deb.nodesource.com/setup_4.x | sudo bash -
RUN apt-get install --yes nodejs
RUN apt-get install --yes build-essential


COPY . /src
RUN npm install
RUN npm run build

# Run app using nodemon
CMD ["npm","run", "start:prod"]