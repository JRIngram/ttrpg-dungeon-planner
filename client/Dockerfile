# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG NODE_VERSION=22.12.0

# --- BUILD ---
FROM node:${NODE_VERSION}-alpine AS build
# Use production node environment by default.
# ENV NODE_ENV production

WORKDIR /usr

COPY . .
RUN ls -la /usr
CMD cat /usr/package.json

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage a bind mounts to package.json and package-lock.json to avoid having to copy them into
# into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci
# THE ABOVE ISNT USING A DEV BUILD!!!!

RUN npm run tailwind:build
RUN npm run build

EXPOSE 3000

# # --- PRODUCTION ---
FROM node:${NODE_VERSION}-alpine AS prod 
WORKDIR /usr
ENV NODE_ENV production

COPY --from=build /usr/package*json ./
COPY --from=build /usr/.next ./.next
RUN npm ci --omit=dev
CMD ls -la
CMD cat package.json
EXPOSE 3000
CMD npm start