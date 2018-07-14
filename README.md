# Simple_Address_Book_API
Javascript - Express - Node - MongoDB


1) Write a command-line nodejs program which is invoked as:
  $ ./index.js PORT
  
2) This invocation should start a web server listening on port PORT. It should use the mongo database at mongodb://localhost:27017/contacts as its database.

3) The web server should respond to the following relative URL's (relative to the base url of scheme, hostname and port) and HTTP methods:

4) PUT /contacts/name The request must have a body which must be a JSON object. If the request is successful then it must store the entire JSON object so that it can be retrieved by the ID part of the URL.

5) If there was a previously created contact for name, then the server should update it to the JSON object provided in the request and return a status code of 204 NO CONTENT.

6) If there was no previously created contact for name, then the server must create a user for name set to the JSON object and return a 201 CREATED status code with a Location header set to the request URL.

7) GET /contacts/name This request should return a JSON of the information previously stored under name. If the contact specified by name is not found, then the server must return a 404 NOT FOUND status code.

8) DELETE /contacts/name This request should delete the object previously stored under name. If the user specified by name is not found, then the server must return a 404 NOT FOUND status code.

9) POST /users/ID This request is used to update the user stored for ID. The body of this request must be a JSON object. If the name field of the URL does not reference an existing contact, then the server must return a 404 NOT_FOUND status code.

10) Otherwise it should replace the contact stored under name with the contents of the JSON object in the body of the request and return a 303 SEE OTHER status code with Location header set to the request URL.

11) The program must report all errors to the client using a suitable HTTP error code as documented above. If there is an error during processing, then the server should return a 500 INTERNAL SERVER ERROR status code. Additionally, the program should log a suitable message on standard error (using console.error()).
