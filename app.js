const express = require("express");

const app = express();

const db = require("./models/index");

const { Member } = db;

app.use(express.json());

app.get("/api/members", async (req, res) => {
  // request객체의 query라는 객체는 url의 query의 표시한 여러 parameter들이 담겨져 있다.
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
  // 새로운 정보는 request의 body에 담겨져 있고 req.body로 가져올 수 있다.
  // console.log(req.body);
  const newMember = req.body;
  // const member = Member.build(newMember);
  // await member.save();
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
  // const membersCount = members.length;
  // members = members.filter((members) => members.id !== Number(id));
  // if (members.length < membersCount) {
  //   res.send({ message: "Deleted" });
  // } else {
  //   res.status(404).send({ message: "There is no member with the id!" });
  // }
});

app.listen(3000, () => {
  console.log("Server is listening....");
});
