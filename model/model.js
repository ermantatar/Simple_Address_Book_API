const contacts = require("./contacts");

function Model(db) {
  this.contacts = new contacts.Contacts(db);
}

module.exports = {
  Model: Model
};
