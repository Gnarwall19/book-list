/* beautify preserve:start */
const expect = require('expect');
const request = require('supertest');
const faker = require('faker');
const { ObjectID } = require('mongodb');
const { app } = require('../server');
const { Book } = require('../models/Book');
/* beautify preserve:end */

var dummyData = [];

for (i = 0; i < 10; i++) {
  dummyData[i] = {
    _id: new ObjectID(),
    title: faker.lorem.word(),
    author: faker.name.firstName()
  }
}

Book.insertMany(dummyData, function (err, res) {
  if (err) throw (err);
  console.log(res);
});