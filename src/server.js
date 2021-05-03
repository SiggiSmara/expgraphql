const result=require('dotenv').config();
var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'database', 
  process.env.DB_USER || 'username', 
  process.env.DB_PWD || 'password', 
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql'
  });

try {
  sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}
// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    hello: String
  }
`);
 
// The root provides a resolver function for each API endpoint
var root = {
  hello: () => {
    return 'Hello world!';
  },
};
 
var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
var myPort = process.env.PORT || 4000;
app.listen(myPort);
console.log('Running a GraphQL API server at http://localhost:' + myPort + '/graphql');