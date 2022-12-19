const express = require("express");

const app = express();

const members = require("./members");

app.get("/api/members", (req, res) => {
  // send메소드에는 다양한 타입의 데이터를 넣어줄 수 있다.
  // 배열을 jSON파일로 변환해서 response의 body의 담아서 보내준다.
  res.send(members);
});

// :id의 의미는 members/의 뒤에 오는 값을 :id(변수)에 대입하라는 의미
// members뒤에는 가변적인 값들이 오는데 그 값들을 id에 담으라는 의미
// 이것을 Route Parameter이라고 한다. path(경로)에 가변적인 값이 전달되는 부분에 사용
app.get("/api/members/:id", (req, res) => {
  // req 객체의 params라는 객체에 프로파티(속성)로 가져올 수 있다.
  // const id = req.params.id;
  const { id } = req.params;
  const member = members.find((m) => m.id === Number(id));
  if (member) {
    res.send(member);
  } else {
    // 정보가 없을시 실행이 되는데 없으면 404라는 상태코드를 보내줄 것
    // res 객체의 status라는 메소드를 사용해서 상태코드를 지정할 수 있다.
    // api서버에는 문장을 바로 보내는 것보다 하나의 JASON객체 안에 넣어서 보내준다.
    // 나중에 response의 추가적인 정보를 넣어줄 때 확장하기가 쉽다.
    res.status(404).send({ message: "There is no such member" });
  }
});

app.listen(3000, () => {
  console.log("Server is listening....");
});
