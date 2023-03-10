const express = require("express");

const app = express();

const db = require("./models/index");

const { Member } = db;

app.use(express.json());

app.get("/api/members", async (req, res) => {
  const { team } = req.query;
  if (team) {
    const teamMembers = await Member.findAll({
      where: { team: team },
      order: [["id", "DESC"]],
    });
    res.send(teamMembers);
  } else {
    // findAll은 모든 테이블을 조회해서 가져온다.
    const members = await Member.findAll({
      // order: [["admissionDate", "DESC"]],
    });
    res.send(members);
  }
});

app.get("/api/members/:id", async (req, res) => {
  const { id } = req.params;
  const member = await Member.findOne({ where: { id } });
  if (member) {
    res.send(member);
  } else {
    res.status(404).send({ message: "There is no such member with the id!!" });
  }
});

app.post("/api/members", async (req, res) => {
  const newMember = req.body;
  const member = await Member.create(newMember);
  res.send(member);
});

app.put("/api/members/:id", async (req, res) => {
  const { id } = req.params;
  const newInfo = req.body;
  const member = await Member.findOne({ where: { id } });
  if (member) {
    Object.keys(newInfo).forEach((prop) => {
      member[prop] = newInfo[prop];
    });
    await member.save();
    res.send(member);
  } else {
    res.status(404).send({ message: "There is no member whit the id!" });
  }
});

app.delete("/api/members/:id", async (req, res) => {
  const { id } = req.params;
  const deletedCount = await Member.destroy({ where: { id } });
  if (deletedCount) {
    res.send({ message: `${deletedCount} row(s) deleted` });
  } else {
    res.status(404).send({ message: "There is no member with the id!" });
  }
});

app.listen(3000, () => {
  console.log("Server is listening....");
});
