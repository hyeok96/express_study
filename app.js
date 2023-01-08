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
  // req 객체의 params라는 객체에 프로파티(속성)로 가져올 수 있다.
  // const id = req.params.id;
  const { id } = req.params;
  const member = await Member.findOne({ where: { id } });
  if (member) {
    res.send(member);
  } else {
    // 정보가 없을시 실행이 되는데 없으면 404라는 상태코드를 보내줄 것
    // res 객체의 status라는 메소드를 사용해서 상태코드를 지정할 수 있다.
    // api서버에는 문장을 바로 보내는 것보다 하나의 JASON객체 안에 넣어서 보내준다.
    // 나중에 response의 추가적인 정보를 넣어줄 때 확장하기가 쉽다.
    res.status(404).send({ message: "There is no such member with the id!!" });
  }
});

// 정보를 추가할 떄는 app객체의 post함수 사용
// /api/members로 오는 post request를 처리할 수 있다.
//
app.post("/api/members", async (req, res) => {
  // 새로운 정보는 request의 body에 담겨져 있고 req.body로 가져올 수 있다.
  // console.log(req.body);
  const newMember = req.body;
  // const member = Member.build(newMember);
  // await member.save();
  const member = await Member.create(newMember);
  res.send(member);
});

// app.put("/api/members/:id", async (req, res) => {
//   const { id } = req.params;
//   const newInfo = req.body;
// const member = members.find((m) => m.id === Number(id));
// if (member) {
//   Object.keys(newInfo).forEach((prop) => {
//     member[prop] = newInfo[prop];
//   });
//   res.send(member);
// } else {
//   res.status(404).send({ message: "There is no member with the id!" });
// }
// const result = await Member.update(newInfo, { where: { id } });
// if (result[0]) {
//   res.send({ message: `${result[0]} row(s) affected` });
// } else {
//   res.status(404).send({ message: `There is no member with the id!` });
// }
// });
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
