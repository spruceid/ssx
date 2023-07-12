FROM node:18
LABEL maintainer "hello@spruceid.com"
COPY ./ /root/ssx
WORKDIR /root/ssx
RUN yarn --unsafe-perm
EXPOSE 8443
ENTRYPOINT ["node", "/root/ssx/packages/ssx-server/bin/ssx-server.js"]
CMD []
