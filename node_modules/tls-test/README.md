# TLS 1.2 for npmjs.com

The public npm registry (npmjs.com) is deprecating insecure versions of
HTTPS and you will be required to use TLS 1.2 (or better) to download
packages.  Most versions of npm and Node.js are ready for this change
but you can test your client by running:

```
npm install -g https://tls-test.npmjs.com/tls-test-1.0.0.tgz
```

This will install a test package over an HTTPS connection that already
enforces TLS 1.2, instead of going to the public npm registry (which does
not yet).

If this command succeeds, it will print the following message:

> Hello!  The tls-test package was successfully downloaded and installed.
>
> Congratulations!  Your package manager appears to support TLS 1.2.

If you do _not_ see this message, then there was a problem downloading
the package.  You should ensure that you are running a [currently supported
version of Node.js](https://nodejs.org/en/about/releases/) and [install
the latest version of npm](https://github.blog/2020-10-13-presenting-v7-0-0-of-the-npm-cli/).

For more information, please see the [npm documentation](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
and if you have questions, check out the Software Development board of the
[GitHub Community forums](https://github.community/c/software-development/47).
