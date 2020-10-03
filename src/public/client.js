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
  if (!state.get("selectedRover")) {
    return `<header></header>
        <main>
            <section>
            <h3>Image/Video of the day</h3>
            ${ImageOfTheDay(state.get("apod"))}
            </section>
            </main>
            <footer></footer>`;
  } else {
    return `<header></header>
    <main>
    <section>
        <main>${latestRoverData(state)}
      </section>
     </main>
     <footer></footer>`;
  }
};

// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.

const ImageOfTheDay = apod => {
  const today = new Date();
  const photodate = new Date(apod.date);
  //console.log(photodate.getDate(), today.getDate());
  //console.log(photodate.getDate() === today.getDate());
  if (!apod) {
    getImageOfTheDay();
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
    
            <img src="${apod.getIn([
              "image",
              "url",
            ])}" height="350px" width="100%" />
            <p>${apod.getIn(["image", "explanation"])}</p>`;
  }
};

const latestRoverData = state => {
  const store = state.toJS();
  let { selectedRover, rovers } = store;

  if (typeof rovers[0] === "string") {
    getRoverData(state);
  } else {
    const data1 = rovers.filter(
      obj => obj.rover.name.toLowerCase() === selectedRover
    );

    return `
    <h3>Picture from Mars!</h3>
    <img src="${data1[0].img_src}" height=600"px" width="100%" />
    <p>Photo ID : ${data1[0].id}</p>
    <p>Date : ${data1[0].earth_date}</p>`;
  }
};

const getImageOfTheDay = () => {
  return fetch(`http://localhost:3000/apod`)
    .then(res => res.json())
    .then(apod => updateStore(store, { apod }));
};

function fetching(rovers) {
  let urls = rovers.map(rover => "/mars?rover=" + rover);
  let data = Promise.all(
    urls.map(url => {
      return fetch(url)
        .then(res => res.json())
        .then(res => res.rover.latest_photos[0]);
    })
  );
  return data;
}

async function getRoverData(state) {
  rovers = await fetching(state.get("rovers"));
  let newStore = store.set("selectedRover", state.get("selectedRover"));
  updateStore(newStore, { rovers });
}

window.addEventListener("load", () => {
  render(root, store);
});

document.getElementById("rovers").addEventListener("change", () => {
  let selectedRover = document.getElementById("rovers").value;
  updateStore(store, { selectedRover });
});
