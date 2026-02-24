const autocannon = require("autocannon");

const BASE_URL = "http://localhost:3000/detail";

const movieIds = [27066];

const instance = autocannon(
  {
    url: BASE_URL,
    connections: 300,
    duration: 15,
    method: "GET",
    requests: movieIds.map((id) => ({
      method: "GET",
      path: `/detail/${id}`,
    })),
  },
  finishedBench,
);

autocannon.track(instance);

function finishedBench(err, res) {
  if (err) {
    console.error("테스트 중 오류:", err);
    return;
  }
  console.log("테스트 완료!");
  console.log(res);
}
