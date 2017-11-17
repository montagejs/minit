# {{copyright}}
# {{name}}-service docker
FROM node:7.9.0

RUN mkdir /home/{{name}}-service
WORKDIR  /home/{{name}}-service

# Install package
ADD package.json ./
RUN npm install

# Then add source after install
ADD index.js index.js

EXPOSE 3000

CMD ["node", "index.js"]