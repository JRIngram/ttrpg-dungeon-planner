# syntax=docker/dockerfile:1
ARG NODE_VERSION=22.12.0

# --- BUILD ---
FROM node:${NODE_VERSION}-alpine AS build
WORKDIR /usr

COPY . .
RUN ls -la /usr
CMD cat /usr/package.json

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

RUN npm run tailwind:build
RUN npm run build

EXPOSE 3000

#--- PRODUCTION ---
FROM node:${NODE_VERSION}-alpine AS prod 
WORKDIR /usr
ENV NODE_ENV production

COPY --from=build /usr/package*json ./
COPY --from=build /usr/.next ./.next
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev
EXPOSE 3000
CMD npm start