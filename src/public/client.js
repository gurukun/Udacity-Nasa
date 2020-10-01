let store = {
  user: { name: "Student" },
  apod: false,
  rovers: ["curiosity", "spirit", "opportunity"],
  status: false,
  selectedRover: false,
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
  let { rovers, apod, status, selectedRover } = state;
  console.log(rovers, selectedRover);

  return `
        <header></header>
        <main>
            ${Greeting(store.user.name)}
            <section>
                <h3>Image/Video of the day</h3>
              
                ${ImageOfTheDay(apod)}
                ${RoverData(apod, rovers, status, selectedRover)}
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

  if (apod.image.code === 404) {
    return `<p>No data is available</p>`;
  }
  // check if the photo of the day is actually type video!
  else if (apod.image.media_type === "video") {
    return `
            <p>See today's featured video <a href="${apod.image.url}">here</a></p>
            <p>${apod.image.title}</p>
            <p>${apod.image.explanation}</p>
        `;
  } else {
    return `
            <img src="${apod.image.url}" height="350px" width="100%" />
            <p>${apod.image.explanation}</p>
        `;
  }
};

const RoverData = (apod, rovers, status, selectedRover) => {
  console.log("apod:" + apod, selectedRover, rovers);

  if (apod && !status && !selectedRover) {
    getRoverData(store);
    return `<p>hi</p>`;
  }
  if (apod && status && !selectedRover) {
    console.log("middle of condition");
    return `<h3>pictures from mars!</h3>
    <img src="${store.rovers[0].img_src}" height=200"px" width="30%" />
    <img src="${store.rovers[1].img_src}" height=200"px" width="30%" />
    <img src="${store.rovers[2].img_src}" height=200"px" width="30%" />
    <p>choose a rover for more details</p>
    `;
  } else {
    console.log("last", selectedRover);
    const data = rovers.filter(
      obj => obj.rover.name.toLowerCase() === selectedRover
    );

    return `
    <h3>Picture from Mars!</h3>
    <img src="${data[0].img_src}" height=600"px" width="100%" />
    <p>Photo ID : ${data[0].id}</p>
    <p>Date : ${data[0].earth_date}</p>`;
  }
};

const getImageOfTheDay = state => {
  let { apod } = state;

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
  let { rovers, selectedRover } = state;
  Object.assign(store, { status: true });

  console.log("inside getrover", selectedRover);

  rovers = await fetching(rovers);

  let names = rovers.map(x => x.rover.name);
  console.log(names);
  updateStore(store, { rovers }); //updatastoreの方がいい？

  //return fetch("/mars?rover=" + rover).then(res => res.json());
}

window.addEventListener("load", () => {
  render(root, store);
});

document.getElementById("rovers").addEventListener("change", () => {
  selectedRover = document.getElementById("rovers").value;
  console.log(selectedRover);
  store = Object.assign(store, { selectedRover });
  console.log(store, "inside of event");
  render(root, store);
});
