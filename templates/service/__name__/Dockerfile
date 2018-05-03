FROM node:4
MAINTAINER Harold Thetiot <harold.thetiot@kaazing.com>

ENV APPDIR /usr/src/app

RUN mkdir -p $APPDIR
WORKDIR $APPDIR

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

COPY . $APPDIR
RUN chown -R nobody:nogroup $APPDIR && chmod -R a-w $APPDIR && ls -ld

# Certs
RUN mkdir -p /etc/certs/prod /etc/certs/staging
VOLUME /etc/certs

USER nobody

# Ports > 1024 since we're not root.
EXPOSE 8080 8443 5001

ENTRYPOINT ["node"]
CMD ["."]
