const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../../app");

const api = supertest(app);

const helper = require("./helper");
const usersHelper = require("../users/helper");

beforeEach(async () => {
  await helper.deleteAll();
  await helper.insertInitialEntries();
});

afterEach(async () => {
  await helper.deleteAll();
});

afterAll(async () => {
  await mongoose.connection.db.collection("sessions").deleteMany({});
  mongoose.connection.close();
});

const createEntry = async (sessionId, statusCode) => {
  const request = api.post("/api/entries");

  if (sessionId) request.set("Cookie", `connect.sid=${sessionId}`);
  request.expect(statusCode);

  return (await request).body;
};

const checkEntryCount = async (increase) => {
  const entriesInDb = await helper.entriesInDb();
  const initialLength = helper.initialEntries().length;

  expect(entriesInDb).toHaveLength(initialLength + increase);
};

describe("creating entries", () => {
  test("works when the user is logged in", async () => {
    const user = {
      firstName: "first",
      lastName: "last",
      username: "myuser",
      password: "mypassword",
    };

    const newUser = await usersHelper.createUser(api, user, 201);
    const sessionId = await usersHelper.login(api, user.username, user.password);
    console.log(sessionId)
    const entry = await createEntry(sessionId, 201);
    console.log(entry)
  });
});