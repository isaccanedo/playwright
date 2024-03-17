---
id: docker
title: "Docker"
---

## Introduction

[Dockerfile.jammy] can be used to run Playwright scripts in Docker environment. These image includes all the dependencies needed to run browsers in a Docker container, and also include the browsers themselves.

## Usage

This Docker image is published to [Microsoft Artifact Registry].

:::info
This Docker image is intended to be used for testing and development purposes only. It is not recommended to use this Docker image to visit untrusted websites.
:::

### Pull the image

```bash js
docker pull mcr.microsoft.com/playwright:v%%VERSION%%-jammy
```

```bash python
docker pull mcr.microsoft.com/playwright/python:v%%VERSION%%-jammy
```

```bash csharp
docker pull mcr.microsoft.com/playwright/dotnet:v%%VERSION%%-jammy
```

```bash java
docker pull mcr.microsoft.com/playwright/java:v%%VERSION%%-jammy
```

### Run the image

By default, the Docker image will use the `root` user to run the browsers. This will disable the Chromium sandbox which is not available with root. If you run trusted code (e.g. End-to-end tests) and want to avoid the hassle of managing separate user then the root user may be fine. For web scraping or crawling, we recommend to create a separate user inside the Docker container and use the seccomp profile.

#### End-to-end tests

On trusted websites, you can avoid creating a separate user and use root for it since you trust the code which will run on the browsers.

```bash js
docker run -it --rm --ipc=host mcr.microsoft.com/playwright:v%%VERSION%%-jammy /bin/bash
```

```bash python
docker run -it --rm --ipc=host mcr.microsoft.com/playwright/python:v%%VERSION%%-jammy /bin/bash
```

```bash csharp
docker run -it --rm --ipc=host mcr.microsoft.com/playwright/dotnet:v%%VERSION%%-jammy /bin/bash
```

```bash java
docker run -it --rm --ipc=host mcr.microsoft.com/playwright/java:v%%VERSION%%-jammy /bin/bash
```

#### Crawling and scraping

On untrusted websites, it's recommended to use a separate user for launching the browsers in combination with the seccomp profile. Inside the container or if you are using the Docker image as a base image you have to use `adduser` for it.

```bash js
docker run -it --rm --ipc=host --user pwuser --security-opt seccomp=seccomp_profile.json mcr.microsoft.com/playwright:v%%VERSION%%-jammy /bin/bash
```

```bash python
docker run -it --rm --ipc=host --user pwuser --security-opt seccomp=seccomp_profile.json mcr.microsoft.com/playwright/python:v%%VERSION%%-jammy /bin/bash
```

```bash csharp
docker run -it --rm --ipc=host --user pwuser --security-opt seccomp=seccomp_profile.json mcr.microsoft.com/playwright/dotnet:v%%VERSION%%-jammy /bin/bash
```

```bash java
docker run -it --rm --ipc=host --user pwuser --security-opt seccomp=seccomp_profile.json mcr.microsoft.com/playwright/java:v%%VERSION%%-jammy /bin/bash
```

[`seccomp_profile.json`](https://github.com/microsoft/playwright/blob/main/utils/docker/seccomp_profile.json) is needed to run Chromium with sandbox. This is a [default Docker seccomp profile](https://github.com/docker/engine/blob/d0d99b04cf6e00ed3fc27e81fc3d94e7eda70af3/profiles/seccomp/default.json) with extra user namespace cloning permissions:

```json
{
  "comment": "Allow create user namespaces",
  "names": [
    "clone",
    "setns",
    "unshare"
  ],
  "action": "SCMP_ACT_ALLOW",
  "args": [],
  "includes": {},
  "excludes": {}
}
```

:::note
Using `--ipc=host` is recommended when using Chrome ([Docker docs](https://docs.docker.com/engine/reference/run/#ipc-settings---ipc)). Chrome can run out of memory without this flag.
:::


### Using on CI

See our [Continuous Integration guides](./ci.md) for sample configs.

## Image tags

See [all available image tags].

Docker images are published automatically by GitHub Actions. We currently publish images with the
following tags:
- `:next` - tip-of-tree image version based on Ubuntu 22.04 LTS (Jammy Jellyfish).
- `:next-jammy` - tip-of-tree image version based on Ubuntu 22.04 LTS (Jammy Jellyfish).
- `:v%%VERSION%%` - Playwright v%%VERSION%% release docker image based on Ubuntu 22.04 LTS (Jammy Jellyfish).
- `:v%%VERSION%%-jammy` - Playwright v%%VERSION%% release docker image based on Ubuntu 22.04 LTS (Jammy Jellyfish).
- `:v%%VERSION%%-focal` - Playwright v%%VERSION%% release docker image based on Ubuntu 20.04 LTS (Focal Fossa).
- `:sha-XXXXXXX` - docker image for every commit that changed
  docker files or browsers, marked with a [short sha](https://git-scm.com/book/en/v2/Git-Tools-Revision-Selection#Short-SHA-1) (first 7 digits of the SHA commit).

:::note
It is recommended to always pin your Docker image to a specific version if possible. If the Playwright version in your Docker image does not match the version in your project/tests, Playwright will be unable to locate browser executables.
:::

### Base images

We currently publish images based on the following [Ubuntu](https://hub.docker.com/_/ubuntu) versions:
- **Ubuntu 22.04 LTS** (Jammy Jellyfish), image tags include `jammy`
- **Ubuntu 20.04 LTS** (Focal Fossa), image tags include `focal`

#### Alpine

Browser builds for Firefox and WebKit are built for the [glibc](https://en.wikipedia.org/wiki/Glibc) library. Alpine Linux and other distributions that are based on the [musl](https://en.wikipedia.org/wiki/Musl) standard library are not supported.

## Using a different .NET version
* langs: csharp

You can use the [.NET install script](https://learn.microsoft.com/en-us/dotnet/core/tools/dotnet-install-script) in order to install different SDK versions:

```bash
curl -sSL https://dot.net/v1/dotnet-install.sh | bash /dev/stdin --install-dir /usr/share/dotnet --channel 6.0
```

## Development
* langs: js

### Build the image

To run Playwright inside Docker, you need to have Node.js, [Playwright browsers](./browsers.md#install-browsers) and [browser system dependencies](./browsers.md#install-system-dependencies) installed. See the following Dockerfile:

```Dockerfile
FROM node:20-bookworm

RUN npx -y playwright@%%VERSION%% install --with-deps
```

Note: official images published to [Microsoft Artifact Registry] are built using [`//utils/docker/build.sh`](https://github.com/microsoft/playwright/blob/main/utils/docker/build.sh) script.

```txt
./utils/docker/build.sh jammy playwright:localbuild-jammy
```

The image will be tagged as `playwright:localbuild-jammy` and could be run as:

```txt
docker run --rm -it playwright:localbuild /bin/bash
```

