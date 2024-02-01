# TypeScript + ExpressJS API
Simple API I've created that is using TypeScript, ExpressJS, and MySQL (Maria)

The motivation was to create an example that new devs can use as a template
to buid APIs

## RUNNING
It's simple... `npm run dev` will build the app and serve it at http://localhost:3000. You can actually open a web-browser to `http://localhost:3000/home` and a web-page will be served (something a lot of APIs don't do)

## DEBUGGING - Probably the command you want
This starts the node server with a debug port running. You can then open `Chrome`, go to `chrome://inspect/#devices` and select your web server as the target.

## TESTING - MANUALLY
I'm using JetBrains as my IDE, which comes with a client that sends HTTP requests

Take a look at `HTTP_LUNCH_ITEMS.http`. You can run this file using a VS Code
Plugin called "REST Client"

You first need to send the POST request, `POST http://localhost:3000/auth`
then you can run the next request
`GET http://localhost:3000/lunchitems`