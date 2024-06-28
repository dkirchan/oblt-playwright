FROM node:20-bookworm

# ENV CI='true'
ENV DEBUG = "pw:api"

WORKDIR /app
COPY . .

RUN npm install
RUN npm ci
# RUN npx -y playwright@1.42.1 install --with-deps
RUN npx -y playwright@1.43.1 install --with-deps
RUN npx -y playwright install --with-deps chromium

CMD ["npx", "playwright", "test", "--grep", "@test_here"]