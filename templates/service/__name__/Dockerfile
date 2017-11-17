# {{name}}-service docker
FROM node:4

RUN mkdir /home/{{name}}-service
WORKDIR  /home/{{name}}-service

# Install package
ADD package.json ./
RUN npm install

# Then add source after install
ADD server

EXPOSE 3000

CMD ["npm", "run", "start"]