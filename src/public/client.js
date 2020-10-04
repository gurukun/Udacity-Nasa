const store = Immutable.Map({
  apod: "",
  rovers: ["curiosity", "spirit", "opportunity"],
  selectedRover: "",
});

// add our markup to the page
const root = document.getElementById("root");

const updateStore = (object, newState) => {
  newStore = store.merge(object, newState);
  render(root, newStore);
};

const render = async (root, state) => {
  root.innerHTML = App(state);
};

// create content
const App = state => {
  if (state.get("selectedRover") === "apod" || state.get("apod")) {
    return `<main>
            <section>
            <h3>Image/Video of the day</h3>
            ${ImageOfTheDay(state.get("apod"))}
            </section>
            </main>`;
  } else {
    return `<main>
    <section>
        <main>${latestRoverData(state)}
      </section>
     </main>
     `;
  }
};

// ------------------------------------------------------  COMPONENTS

const ImageOfTheDay = apod => {
  if (!apod) {
    return getImageOfTheDay();
  } else if (apod.getIn(["image", "code"])) {
    return ` <h2>Sorry. No data is avaialable at the moment😞</h2>`;
  } else if (apod.getIn(["image", "media_type"]) === "video") {
    return `
            <p>See today's featured video <a href="${apod.getIn([
              "image",
              "url",
            ])}">here</a></p>
            <p>${apod.getIn("image", "title")}</p>
            <p>${apod.getIn("image", "explanation")}</p>
        `;
  } else {
    return `

            <img src="${apod.getIn(["image", "url"])}"  class="center">
            <h3>${apod.getIn(["image", "title"])} </h3>
            <p>${apod.getIn(["image", "explanation"])}</p>`;
  }
};

const latestRoverData = state => {
  const store = state.toJS();
  let { selectedRover, rovers } = store;

  if (typeof rovers[0] === "string") {
    return getRoverData(state);
  } else {
    const data = rovers.filter(
      obj => obj.rover.name.toLowerCase() === selectedRover
    );

    return `
    <h3>Picture from Mars!</h3>
    <img src="${data[0].img_src}" class="center">
    <p>Photo ID : ${data[0].id}</p>
    <p>Photo taken on : ${data[0].earth_date}</p>
    <p>Rover Launch Date : ${data[0].rover.launch_date}</p>
    <p>Rover Landing Date : ${data[0].rover.landing_date}</p>
    <p>Rover Status: ${data[0].rover.status}</p>  
    `;
  }
};

const getImageOfTheDay = () => {
  return fetch(`http://localhost:3000/apod`)
    .then(res => res.json())
    .then(apod => updateStore(store, { apod }));
};

const fetchFunc = rovers => {
  let urls = rovers.map(rover => "/mars?rover=" + rover);
  let data = Promise.all(
    urls.map(url => {
      return fetch(url)
        .then(res => res.json())
        .then(res => res.rover.latest_photos[0]);
    })
  );
  return data;
};

async function getRoverData(state) {
  rovers = await fetchFunc(state.get("rovers"));
  let newStore = store.set("selectedRover", state.get("selectedRover"));
  updateStore(newStore, { rovers });
}

const getData = selectedRover => {
  updateStore(store, { selectedRover });
};
