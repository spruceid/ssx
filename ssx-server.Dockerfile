FROM debian:bullseye
LABEL maintainer "hello@spruceid.com"
RUN apt-get update
RUN DEBIAN_FRONTEND=noninteractive apt-get -yq upgrade
RUN DEBIAN_FRONTEND=noninteractive apt-get -yq install wget apt-transport-https gnupg curl libssl-dev git python3 build-essential rustc cargo
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y nodejs
COPY ./ /root/ssx
RUN cd /root/ssx && npm install --unsafe-perm
RUN cd /root/ssx/examples/ssx-test-dapp
EXPOSE 8443
ENTRYPOINT ["node", "/root/ssx/packages/ssx-server/bin/ssx-server.js"]
CMD []
