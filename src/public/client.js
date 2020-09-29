let store = {
  user: { name: "Student" },
  apod: "",
  rovers: false,
};

// add our markup to the page
const root = document.getElementById("root");

const updateStore = (store, newState) => {
  store = Object.assign(store, newState);
  render(root, store);
};

const render = async (root, state) => {
  root.innerHTML = App(state);
};

// create content
const App = state => {
  let { rovers, apod } = state;

  return `
        <header></header>
        <main>
            ${Greeting(store.user.name)}
            <section>
                <h3>Put things on the page!</h3>
                <p>Here is an example section.</p>
                <p>
                    One of the most popular websites at NASA is the Astronomy Picture of the Day. In fact, this website is one of
                    the most popular websites across all federal agencies. It has the popular appeal of a Justin Bieber video.
                    This endpoint structures the APOD imagery and associated metadata so that it can be repurposed for other
                    applications. In addition, if the concept_tags parameter is set to True, then keywords derived from the image
                    explanation are returned. These keywords could be used as auto-generated hashtags for twitter or instagram feeds;
                    but generally help with discoverability of relevant imagery.
                </p>
                ${ImageOfTheDay(apod)}
                ${RoverData(rovers)}
            </section>
        </main>
        <footer></footer>
    `;
};

// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = name => {
  if (name) {
    return `
            <h1>Welcome, ${name}!</h1>
        `;
  }

  return `
        <h1>Hello!</h1>
    `;
};

const ImageOfTheDay = apod => {
  // If image does not already exist, or it is not from today -- request it again
  const today = new Date();
  const photodate = new Date(apod.date);
  //console.log(photodate.getDate(), today.getDate());
  //console.log(photodate.getDate() === today.getDate());
  if (!apod || apod.date === today.getDate()) {
    getImageOfTheDay(store);
  }
  // check if the photo of the day is actually type video!
  if (apod.media_type === "video") {
    return `
            <p>See today's featured video <a href="${apod.url}">here</a></p>
            <p>${apod.title}</p>
            <p>${apod.explanation}</p>
        `;
  } else {
    return `
            <img src="${apod.image.url}" height="350px" width="100%" />
            <p>${apod.image.explanation}</p>
        `;
  }
};

const RoverData = rovers => {
  if (!rovers) {
    return `<p>"Choose a rover to see the latest image!"</p>`;
  } else if (
    rovers === "curiosity" ||
    rovers === "opportunity" ||
    rovers === "spirit"
  ) {
    console.log(rovers); //returns rover name
    getRoverData(rovers, store);
  } else {
    console.log(rovers);
    return `
            <h3>Picture from Mars!</h3>
            <img src="${rovers.rover.latest_photos[0].img_src}" height=600"px" width="100%" />
            <p>Photo ID : ${rovers.rover.latest_photos[0].id}</p>
            <p>Date : ${rovers.rover.latest_photos[0].earth_date}
             `;
  }
};

const getImageOfTheDay = state => {
  let { apod } = state;

  fetch(`http://localhost:3000/apod`)
    .then(res => res.json())
    .then(apod => updateStore(store, { apod }));
};

const getRoverData = (rover, state) => {
  console.log(state);
  let { rovers } = state;
  //mapで３つ全部のデータを入れる？
  //rovers をデフォルトアレイにして、３つの名前を入れる＝＞それをMapでオブジェクトに返す。
  fetch("/mars?rover=" + rover)
    .then(res => res.json())
    .then(rovers => updateStore(store, { rovers }));
};

window.addEventListener("load", () => {
  render(root, store);
});

document.getElementById("rovers").addEventListener("change", () => {
  rovers = document.getElementById("rovers").value;
  store = Object.assign(store, { rovers });
  render(root, store);
});
