const assert = require("assert");

const CONTACTS = "contacts";
const DEFAULT_CONTACTS = "./contacts_data";
const DATA = "_data";

function Contacts(db) {
  this.db = db;
  this.contacts = db.collection(CONTACTS);
}

function initContacts(db, contactsData = null) {
  return new Promise(function(resolve, reject) {
    if (contactsData === null) {
      contactsData = require(DEFAULT_CONTACTS);
    }
    let d = [];
    for (let u of contactsData) {
      d.push({ _name: u.name, DATA: u });
    }
    const collection = db.collection(CONTACTS);
    collection.deleteMany({}, function(err, result) {
      if (err !== null) reject(err);
      collection.insertMany(d, function(err, result) {
        if (err !== null) reject(err);
        if (result.insertedCount !== d.length) {
          reject(
            Error(`insert count ${result.insertedCount} !== ` + `${d.length}`)
          );
        }
        resolve(db);
      });
    });
  });
}

Contacts.prototype.getUser = function(name, mustFind = true) {
  const searchSpec = { _name: name };
  return this.contacts
    .find(searchSpec)
    .toArray()
    .then(function(contacts) {
      return new Promise(function(resolve, reject) {
        if (contacts.length === 1) {
          resolve(contacts[0].DATA);
        } else if (contacts.length == 0 && !mustFind) {
          resolve(null);
        } else {
          reject(new Error(`cannot find user ${name}`));
        }
      });
    });
};

Contacts.prototype.newUser = function(name, user) {
  const d = { _name: name, DATA: user };
  return this.contacts.insertOne(d).then(function(results) {
    return new Promise(resolve => resolve(results.insertedname));
  });
};

Contacts.prototype.deleteUser = function(name) {
  return this.contacts.deleteOne({ _name: name }).then(function(results) {
    return new Promise(function(resolve, reject) {
      if (results.deletedCount === 1) {
        resolve();
      } else {
        reject(new Error(`cannot delete user ${name}`));
      }
    });
  });
};

Contacts.prototype.updateUser = function(name, user) {
  const d = { _name: name, DATA: user };
  return this.contacts.replaceOne({ _name: name }, d).then(function(result) {
    return new Promise(function(resolve, reject) {
      if (result.modifiedCount != 1) {
        reject(new Error(`updated ${result.modifiedCount} contacts`));
      } else {
        resolve();
      }
    });
  });
};

module.exports = {
  Contacts: Contacts,
  initContacts: initContacts
};
