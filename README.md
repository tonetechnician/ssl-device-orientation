# How to Enable Device Orientation with HTTPS connection

This example has been taken from [here](https://blog.usejournal.com/securing-node-js-apps-with-ssl-tls-b3570dbf84a5).

It is combined with the example taken from [here](https://developer.mozilla.org/en-US/docs/Web/API/Detecting_device_orientation) to demonstrate how https enables device orientation within the chrome and other browsers.

As seen in index.js, the openssl tool is used to generate the SSL/TLS certificate required by the browser to secure the connection. Currently a basic certificate is generated with the following credentials. 


**Certificate Details**
- Lifetime: 365 days

- Country: US
- State: Foo
- Location: Bar
- Organization: Baz
- Organizational Unit: --
- Common Name: localhost

## Installation
### MacOSX

Type `npm install`

This will install all the required packages.

MacOSx and Linux comes with openssl installed so you will not need to install it. If for some reason you don't have openssl installed, type 

`brew install openssl`

### Windows

If you are on Windows, you'll need to install openssl yourself. I recommend using [chocolatey](https://chocolatey.org/).

Install chocolatey by typing the following in a PowerShell with admin rights:

`Set-ExecutionPolicy Bypass -Scope Process -Force; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))`

Once installed, type 

`choco install openssl.light`

## How to Run 

To run the example, simply run with arguments. 

`node index.js --host <YOUR_IP_ADDRESS> --port <YOUR_PORT> --protocol <SPECIFIED_PROTOCOL`

If the arguments are not specified it will default to 

`node index.js --host localhost --port 3000 --protocol https`