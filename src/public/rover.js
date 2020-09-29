const rover = {
  rover: {
    latest_photos: [
      {
        id: 318477,
        sol: 2208,
        camera: {
          id: 30,
          name: "PANCAM",
          rover_id: 7,
          full_name: "Panoramic Camera",
        },
        img_src:
          "http://mars.nasa.gov/mer/gallery/all/2/p/2208/2P322473707ESFB27MP2600L8M1-BR.JPG",
        earth_date: "2010-03-21",
        rover: {
          id: 7,
          name: "Spirit",
          landing_date: "2004-01-04",
          launch_date: "2003-06-10",
          status: "complete",
        },
      },
      {
        id: 318478,
        sol: 2208,
        camera: {
          id: 30,
          name: "PANCAM",
          rover_id: 7,
          full_name: "Panoramic Camera",
        },
        img_src:
          "http://mars.nasa.gov/mer/gallery/all/2/p/2208/2P322473707ESFB27MP2600R8M1-BR.JPG",
        earth_date: "2010-03-21",
        rover: {
          id: 7,
          name: "Spirit",
          landing_date: "2004-01-04",
          launch_date: "2003-06-10",
          status: "complete",
        },
      },
    ],
  },
};
console.log(rover.rover.latest_photos[0].img_src);
