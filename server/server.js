const express = require("express");
const bodyParser = require("body-parser");

const OK = 200;
const CREATED = 201;
const NO_CONTENT = 204;
const MOVED_PERMANENTLY = 301;
const FOUND = 302;
const SEE_OTHER = 303;
const NOT_MODIFIED = 303;
const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const CONFLICT = 409;
const SERVER_ERROR = 500;

function serve(port, model) {
  const app = express();
  app.locals.model = model;
  app.locals.port = port;
  setupRoutes(app);
  app.listen(port, function() {
    console.log(`listening on port ${port}`);
  });
}

function setupRoutes(app) {
  app.use("/contact/:name", bodyParser.json());
  app.use("/contact/:name", cacheContact(app));
  app.put("/contact/:name", newContact(app));
  app.get("/contact/:name", getContact(app));
  app.delete("/contact/:name", deleteContact(app));
  app.post("/contact/:name", updateContact(app));
}

module.exports = {
  serve: serve
};

function getContact(app) {
  return function(request, response) {
    if (!request.contact) {
      response.sendStatus(NOT_FOUND);
    } else {
      response.json(request.contact);
    }
  };
}

function deleteContact(app) {
  return function(request, response) {
    if (!request.contact) {
      response.sendStatus(NOT_FOUND);
    } else {
      request.app.locals.model.contacts
        .deleteContact(request.params.name)
        .then(() => response.sendStatus(NO_CONTENT))
        .catch(err => {
          console.error(err);
          response.sendStatus(SERVER_ERROR);
        });
    }
  };
}

function newContact(app) {
  return function(request, response) {
    const contactInfo = request.body;
    const name = request.params.name;
    if (typeof contactInfo === "undefined") {
      console.error(`missing body`);
      response.sendStatus(BAD_REQUEST);
    } else if (request.contact) {
      request.app.locals.model.contacts
        .updateContact(name, contactInfo)
        .then(function(name) {
          response.sendStatus(NO_CONTENT);
        })
        .catch(err => {
          console.error(err);
          response.sendStatus(SERVER_ERROR);
        });
    } else {
      request.app.locals.model.contacts
        .newContact(name, contactInfo)
        .then(function(name) {
          response.redirect(CREATED, requestUrl(request));
        })
        .catch(err => {
          console.error(err);
          response.sendStatus(SERVER_ERROR);
        });
    }
  };
}

function updateContact(app) {
  return function(request, response) {
    const name = request.params.name;
    const contactInfo = request.body;
    if (!request.contact) {
      console.error(`contact ${request.params.name} not found`);
      response.sendStatus(NOT_FOUND);
    } else {
      request.app.locals.model.contacts
        .updateContact(name, contactInfo)
        .then(function(name) {
          response.redirect(SEE_OTHER, requestUrl(request));
        })
        .catch(err => {
          console.error(err);
          response.sendStatus(SERVER_ERROR);
        });
    }
  };
}

function cacheContact(app) {
  return function(request, response, next) {
    const name = request.params.name;
    if (typeof name === "undefined") {
      response.sendStatus(BAD_REQUEST);
    } else {
      request.app.locals.model.contacts
        .getContact(name, false)
        .then(function(contact) {
          request.contact = contact;
          next();
        })
        .catch(err => {
          console.error(err);
          response.sendStatus(SERVER_ERROR);
        });
    }
  };
}

//Should not be necessary but could not get relative URLs to work
//in redirect().
function requestUrl(req) {
  const port = req.app.locals.port;
  return `${req.protocol}://${req.hostname}:${port}${req.originalUrl}`;
}
