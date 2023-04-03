const request = require("supertest");
const authServer = require("./authServer");
const appServer = require("./appServer");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose");

beforeAll(async () => {
  const url =
    "mongodb+srv://root:Wie1uwyhsWOmsDnv@cluster0.whplb.mongodb.net/test";
  await mongoose.connect(url, { useNewUrlParser: true });
});

AUTHORIZATION_HEADER = "";
ACCESS_TOKEN = "";
REFRESH_TOKEN = "";

describe("POST /register", () => {
  it("Tests a register user. Tests to make sure hashed password is correct", async () => {
      let randomNumber = Math.floor(Math.random() * 10000);
      const res = await request(authServer).post("/register").send({
          "username": "test" + randomNumber,
          "password": "test" + randomNumber,
          "email": "test" + randomNumber + "@test.ca",
          "admin": false
      });
      const isPasswordCorrect = await bcrypt.compare("test" + randomNumber, res.body.password)
      expect(res.statusCode).toBe(200);
      expect(isPasswordCorrect).toBe(true);
  });
});

describe("POST /login", () => {
    it("Trying logging in", async () => {
        const res = await request(authServer)
            .post("/login")
            .send({username: "admin", password: "admin"});
        console.log(res.body);
        console.log(res.headers.authorization);
        expect(res.status).toBe(200);
        expect(res.body.username).toBe("admin");
        AUTHORIZATION_HEADER = res.headers.authorization;
        ACCESS_TOKEN = AUTHORIZATION_HEADER.split("Bearer ")[1].split(" Refresh")[0];
        REFRESH_TOKEN = AUTHORIZATION_HEADER.split("Refresh ")[1];
        console.log("Access token from login:" + AUTHORIZATION_HEADER);
    })
});

describe("POST /login", () => {
  it("Test that the /login endpoint throws a PokemonAuthError for invalid credentials", async () => {
      const res = await request(authServer).post("/login").send({
          "username": "asdfsdf",
          "password": "asdfsafdf",
      });
      // console.log(res);
      // jwt.verify()
      expect(res.status).toBe(401);
      expect(res.error.text.includes('Authentication Error')).toBe(true);
  });
});

describe("POST /requestNewAccessToken", () => {
  it("Test that the /requestNewAccessToken endpoint returns a new JWT access token for a valid refresh token", async () => {
      
      const res1 = await request(authServer).post("/login").send({
          "username": "admin",
          "password": "admin",
      });
      //const refreshT = res1.header["auth-token-refresh"];
      
      const res = await (await request(authServer).post("/requestNewAccessToken")
      .set('Authorization', AUTHORIZATION_HEADER));
      
      // const date = new Date()
      // const exptime = jwt.verify(res.header["auth-token-access"], process.env.ACCESS_TOKEN_SECRET).exp;
      // const timeNow = date.getTime() / 1000;
      // console.log(res);
      // jwt.verify()
      expect(res.status).toBe(200);
      // expect(exptime > timeNow).toBe(true);
  });
});

describe("POST /requestNewAccessToken", () => {
  it("Test that the /requestNewAccessToken endpoint throws a PokemonAuthError for an invalid or missing refresh token", async () => {
      
      const refreshT = 'foo';
      
      const res = await (await request(authServer).post("/requestNewAccessToken")
      .set('Authorization', refreshT));
      
      console.log("HEADERS HERE 2\n");
      console.log(AUTHORIZATION_HEADER);
      console.log(res.headers);      // jwt.verify()
      expect(res.status).toBe(401);
      expect(res.error.text.includes('Authentication Error')).toBe(true);
  });
});

// describe("Test successful GET request", () => {
//     it("Successful GET request for Ponyta", async () => {

//         console.log("Access token is : " + AUTHORIZATION_HEADER);
//         const req = request(appServer)
//           .get("/api/v1/pokemon?id=77")
//           .set("Authorization", AUTHORIZATION_HEADER);
        
//         console.log(req.headers);

//         // const res = await request(appServer)
//         //     .get("/api/v1/pokemon?id=77")
//         //     .set("Authorization", AUTHORIZATION_HEADER);
//         //const res = await request(appServer).get("/api/v1/pokemon?id=77").set({"Authorization": AUTHORIZATION_HEADER});
//         const res = await req;
//         console.log("HEADERS HERE\n");
//         console.log(AUTHORIZATION_HEADER);
//         //console.log(res.headers);

//         expect(res.status).toBe(200);
//     })
// });

describe("Test successful GET request", () => {
  it("Successful GET request for Ponyta", async () => {

      console.log("Access token is : " + AUTHORIZATION_HEADER);
      const req = request(appServer)
        .get("/api/v1/pokemon?id=77")
        .set("Authorization", AUTHORIZATION_HEADER);
      
      console.log(req.headers);

      return req.then(res => {
          console.log("HEADERS HERE\n");
          console.log(AUTHORIZATION_HEADER);
          console.log(res.headers);

          expect(res.status).toBe(200);
      }).catch(err => {
          console.error(err);
      });
  })
});

describe("Test GET", () => {
  it("Test unsuccessful GET request", async () => {
      // console.log("Access token is : " + "skajfldsj");
      const res1 = await request(authServer).post("/login").send({
        "username": "test3580",
        "password": "test3580",
      });
      const refreshT = jwt.sign({ user: "test3580" }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '0s' })
          
      const res = await request(appServer)
          //.post("/http://localhost:6001/api/v1/pokemons")
          .get("/api/v1/pokemons").query({count: 10, after: 0})
          .set({"auth-token-access": `${refreshT}`});
      // console.log("response body is :");
      // console.log(res.body);
      //console.log(res.body[0].id);
      expect(res.status).toBe(401);
      //expect(res.body[0].id).toBe(77);
  })
});


describe("GET /api/v1/pokemons", () => {
	it("Test that an unauthenticated user cannot access protected endpoints", async () => {

		// const res = await request(appServer).get("/api/v1/pokemon?id=77&appid").set({"Authorization": "foo"});
		const res = await request(appServer).get("/api/v1/pokemon?id=77&appid").query({ count: 10, after: 0 });

		expect(res.status).toBe(401);
	});
});

describe("GET /api/v1/pokemons", () => {
  it("Test that a request with an invalid JWT access token throws a PokemonAuthError", async () => {
      const res1 = await request(authServer).post("/login").send({
          "username": "test3580",
          "password": "test3580",
      });

      const refreshT = 'abc';
      const res = await request(appServer).get("/api/v1/pokemons").query({count: 10, after: 0}).set('auth-token-access', `${refreshT}`);

      expect(res.status).toBe(401);     
      expect(res.error.text.includes('No Token: Please provide the access token using the headers.')).toBe(true);
  });
});


describe("GET /api/v1/pokemons", () => {
  it("Test that a refresh token cannot be used to access protected endpoints", async () => {
      const res1 = await request(authServer).post("/login").send({
          "username": "test3580",
          "password": "test3580",
      });
      const refreshT = res1.header["auth-token-refresh"];
      
      const res = await request(appServer).get("/api/v1/pokemons").query({count: 10, after: 0}).set('auth-token-refresh', `${refreshT}`);

      expect(res.status).toBe(401);
  });
});

describe("GET /api/v1/pokemons", () => {
  it("Test that a request with an invalid or missing refresh token throws a PokemonAuthError", async () => {
      
      const res = await request(appServer).get("/api/v1/pokemons").query({count: 10, after: 0});
      expect(res.status).toBe(401);
      expect(res.error.text.includes('No Token: Please provide the access token using the headers.')).toBe(true);
    });
});

describe("PATCH /api/v1/pokemon/:id", () => {
  it("Test that non-admin user cannot access admin protected routes", async () => {
      const res1 = await request(authServer).post("/login").send({
          "username": "test1051",
          "password": "test1051",
      });
      const refreshT = res1.header["auth-token-access"];
      
      const res = await request(appServer).patch("/api/v1/pokemon/1").send(
          {
              "name": {
                "english": "test",
                "japanese": "test",
                "chinese": "test",
                "french": "test"
              },
              "base": {
                "HP": 60,
                "Defense": 75,
                "Speed": 30,
                "Special Attack": 35,
                "Special Defense": 25
              },
              
              "id": 1,
              "type": [
                "Bug"
              ],
              "__v": 0
            }
      ).set('auth-token-access', `${ACCESS_TOKEN}`);

      expect(res.status).toBe(401);
      console.log(res.error.text);
  });
});

describe("GET /api/v1/pokemons", () => {
	it("test that after logging out, a user cannot access protected routes until the user re-login", async () => {
		const res1 = await request(authServer).post("/login").send({
			"username": "test3580",
			"password": "test3580",
		});
		const refreshT = res1.header["auth-token-access"];
		const res2 = await request(authServer).get("/logout").query({ appid: res1.body['_id'] });
        // successfully logged out, userModel token_valid attribute is updated to false
        expect(res2.status).toBe(200);

		const res = await request(appServer).get("/api/v1/pokemons").query({ count: 10, after: 0 }).set('auth-token-access', `${refreshT}1`);
		expect(res.status).toBe(401);
	});
});

afterAll(async () => {
  await mongoose.connection.close();
});

