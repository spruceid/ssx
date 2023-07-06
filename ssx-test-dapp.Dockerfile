FROM node:18
LABEL maintainer "hello@spruceid.com"
COPY ./ /root/ssx
RUN cd /root/ssx && npm install --unsafe-perm
EXPOSE 3000
WORKDIR /root/ssx/examples/ssx-test-app
ENTRYPOINT ["npm", "start"]
CMD []
