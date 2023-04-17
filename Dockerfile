FROM --platform=$BUILDPLATFORM node:18.16-buster-slim AS client-builder
WORKDIR /ui
# cache packages in layer
COPY ui/package.json /ui/package.json
COPY ui/package-lock.json /ui/package-lock.json
RUN --mount=type=cache,target=/usr/src/app/.npm \
    npm set cache /usr/src/app/.npm && \
    npm ci
# install
COPY ui /ui
RUN npm run build

FROM alpine
LABEL org.opencontainers.image.title="Tachometer" \
    org.opencontainers.image.description="Extension shows real-time cpu and memory usage of containers" \
    org.opencontainers.image.vendor="julian-b90" \
    com.docker.extension.screenshots='[{"alt":"tachometer", "url":"https://raw.githubusercontent.com/julian-b90/tachometer/main/screenshot.png"}]' \
    com.docker.desktop.extension.api.version="0.3.4" \
    com.docker.desktop.extension.icon="https://raw.githubusercontent.com/julian-b90/tachometer/main/speedometer.png" \
    com.docker.extension.detailed-description="Extension shows real-time cpu and memory usage of containers" \
    com.docker.extension.publisher-url="https://github.com/julian-b90/tachometer" \
    com.docker.extension.additional-urls='[{"title":"Issues","url":"https://github.com/julian-b90/tachometer/issues"}]' \
    com.docker.extension.changelog="<p>### Changed</p><ul><li>add useMemo and useCallback to reduce rerender</li><li>resize the screenshot to reduce the size</li" \
    com.docker.extension.categories="development,utility-tools"

COPY docker-compose.yaml .
COPY metadata.json .
COPY speedometer.svg .
COPY --from=client-builder /ui/build ui
