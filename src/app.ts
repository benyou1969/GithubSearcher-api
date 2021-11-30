import axios from "axios";
import express from "express";
import Redis from "ioredis";
import { RequestBody, TypeSearch } from "types";
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import swaggerDocument from "../swagger.json";


const app = express();
const redis = new Redis();
const port = 8000;

app.use(express.json());
//* enable cors for the frontend app
app.use(cors())
//* enable swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
/*
 * method to check if the request was cached before or not
 * @param req
 * @param res
 * @param next
 */

const cache = (req, res, next) => {
  const { searchTerm, searchType }: RequestBody = req.body;
  console.log("Cache { searchTerm, searchType }",{ searchTerm, searchType })
  const type =
    searchType === TypeSearch.ISSUES
      ? TypeSearch.ISSUES
      : searchType === TypeSearch.USERS
      ? TypeSearch.USERS
      : searchType === TypeSearch.REPOSITORIES
      ? TypeSearch.REPOSITORIES
      : TypeSearch.USERS;

  //* key to be used in redis
  const key = `${searchTerm}-${type}`;
  redis.get(key, (error, result) => {
    if (error) throw error;
    if (result !== null) {
      return res.json(JSON.parse(result));
    } else {
      return next();
    }
  });
};

//* GET request to test api
app.get("/ping", (req, res) => res.send("pong"));

//* POST request to search for users, repositories, or issues
app.post("/api/search", cache, async (req, res) => {
  const { searchTerm, searchType }: RequestBody = req.body;
 console.log("{ searchTerm, searchType }",{ searchTerm, searchType })
  //* check if the search type is valid and return type value
  const type =
    searchType === TypeSearch.ISSUES
      ? TypeSearch.ISSUES
      : searchType === TypeSearch.USERS
      ? TypeSearch.USERS
      : searchType === TypeSearch.REPOSITORIES
      ? TypeSearch.REPOSITORIES
      : TypeSearch.USERS;

  //* key to be used in redis
  const key = `${searchTerm}-${type}`;
  try {
    const { data } = await axios.get(
      `https://api.github.com/search/${type}?q=${searchTerm}`
    );

    //* store the result in redis cache for 2 hours
    redis.set(key, JSON.stringify(data), "ex", 60 * 60 * 2);
    return res.json(data);
  } catch (err) {
    console.log(err);
  }
});

//* GET request to clear the cache
app.get("/api/clear-cache", (req, res) => {
  redis.flushall();
  return res.send("Cache was cleared");
});

//* Start the server
app.listen(port, () => {
  console.log(`Server status: http://localhost:${port}/ping`);
});
