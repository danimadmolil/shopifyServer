const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = 4000;
const { PrismaClient } = require("@prisma/client");
const e = require("express");
const prisma = new PrismaClient();
const cors = require("cors");
const expressSession = require("express-session");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "http://localhost:3000");
//   res.header("Access-Control-Allow-Credentials", true);
//   res.header("Access-Control-Allow-Headers", "POST ,GET ,PUT ,DELETE");
//   res.send();
// });
app.use(
  cors({
    optionsSuccessStatus: 200,
    origin: "http://localhost:3000",
    credentials: true,
    maxAge: 360000,

    allowedHeaders: [
      "Set-Cookie",
      "Content-Type",
      "Authorization",
      "Access-Control-Request-Headers",
    ],
  })
);
app.use(
  expressSession({
    cookie: {
      sameSite: "none",
      httpOnly: true,
      // secure: true,
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, // ms
    },
    secret: "a santa at nasa",
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get("/users", async (req, res) => {
  const allUsers = await prisma.user.findMany();
  // prisma
  res.json({ data: allUsers });
});
app.post("/user", async (req, res) => {
  console.log({ ...req.body });
  try {
    const result = await prisma.user.create({
      data: {
        ...req.body,
      },
    });
    console.log("result", result);
  } catch (e) {
    console.log("error");
  }
});
app.delete("/user/:userId", async (req, res) => {
  try {
    const result = await prisma.user.delete({
      where: { id: Number(req.params.userId) },
    });
    console.log("result", result);
  } catch (e) {
    console.log("error to delete user ");
  }
});
app.post("/menu", async (req, res) => {
  const result = await prisma.menu.create({ data: req.body });
  // console.log("prisma", req.body);
  res.jsonp(result);
});

app.get("/signin", async (req, res) => {
  res.jsonp(prisma.session.findMany({}));
});
app.post("/signup", async (req, res) => {
  const { email, password, name } = req.body;

  if (typeof email === "string" && typeof password === "string") {
    try {
      const result = await prisma.user.create({
        data: {
          email,
          password,
          name: name ? name : "undefind",
        },
      });
    } catch (e) {
      res.jsonp({ error: "errror" });
    }
  } else {
    res.jsonp({ error: "emailt or password should not be blank" });
  }
});

app.get("/menu", async (req, res) => {
  console.log("subMenuss", generateInclued(5));
  const result = await prisma.menu.findMany({
    where: {
      parentMenu: null,
    },
    include: {
      subMenu: {
        include: {
          subMenu: {
            include: {
              subMenu: {
                include: {
                  subMenu: {
                    include: {
                      subMenu: {
                        include: {
                          subMenu: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
  // const data = [
  //   ...result.map((item) => ({ ...item, subMenu: { ...item.subMenu } })),
  // ];
  // result.data.forEach((item) => {});
  // console.log(data);
  res.send({ data: result });
});
//default response
app.use((req, res) => {
  res.jsonp({ error: "404 NotFound" });
});
app.listen(PORT, () => console.log("Server is running at prot" + PORT));
