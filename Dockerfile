FROM node:12.19-slim

ENV USER=thisgleam-botmusic

# install python and make
RUN apt-get update && \
	apt-get install -y python3 build-essential && \
	apt-get purge -y --auto-remove
	
# create thisgleam-botmusic user
RUN groupadd -r ${USER} && \
	useradd --create-home --home /home/thisgleam-botmusic -r -g ${USER} ${USER}
	
# set up volume and user
USER ${USER}
WORKDIR /home/thisgleam-botmusic

COPY package*.json ./
RUN npm install
VOLUME [ "/home/thisgleam-botmusic" ]

COPY . .

ENTRYPOINT [ "node", "index.js" ]
