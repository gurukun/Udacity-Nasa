let store = {
  user: { name: "Student" },
  apod: "",
  rovers: ["curiosity", "sprit", "opportunity"],
};

const getRoverData = state => {
  let { rovers } = state;
  console.log(rovers);
  let test = rovers.map(rover => {
    return rover;
  });
  console.log(test);
};
getRoverData(store);
