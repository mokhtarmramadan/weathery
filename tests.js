var express = require("express")
var { createHandler } = require("graphql-http/lib/use/express")
var { buildSchema } = require("graphql")
var { ruruHTML } = require("ruru/server")

const schema = buildSchema(`
  type Query {
    quoteOfTheDay: String
    random: Float
    rollThreeDice: [Int]
    }
`);

const root = {
  quoteOfTheDay() {
    return "Hello, world!";
  },
  random() {
    return 1.5;
  },
  rollThreeDice() {
    return [1, 2, 4]
  }
};

const app = express();

app.all(
  "/graphql",
   createHandler({
     schema: schema,
     rootValue: root,
   })
);

app.get("/", (_req, res) => {
  res.type("html")
  res.end(ruruHTML({ endpoint: "/graphql" }))
})

app.listen(4000);
console.log("running");
