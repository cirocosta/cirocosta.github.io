---
title: Docker
date: 22 Out, 2015
description:
published: false
tags: [devops]
---

```sh
#     subcommand
#         \/
$ docker  run  hello-world
#   ^               ^
# image         image to load
```

*Container*

:   stripped-to-basics isolated version of a Linux operating system.  *Linux Containers* is an OS-level virtualization environment for running multiple isolated linux systems on a single Linux control host.

  It provides limitation and priorization of resources without the need for starting any virtual machines.

  Containers also give namespace isolation (and so isolation of an applications' view of the operating environment, including process trees, networking, uids and mounter fs's.

*Image*

:   software load into the container.

*Dockerfile*

:   a file that describes the software that is 'baked' into an image.
