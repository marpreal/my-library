  interface Category {
    id: string;
    title: string;
    description: string;
    backgroundImage: string;
    link: string;
  }
  
  export const categories: Category[] = [
    {
      id: "books",
      title: "Library",
      description: "Like GoodReads but better.",
      backgroundImage: "/background.jpg",
      link: "/books",
    },
    {
      id: "movies",
      title: "Movie Collection",
      description: "A curated list of must-watch movies.",
      backgroundImage: "/movies-background.jpg",
      link: "/movies",
    },
    {
      id: "recipes",
      title: "Recipes",
      description: "Delicious recipes for every taste.",
      backgroundImage: "/recipes-background.jpg",
      link: "/recipes",
    },
    // {
    //   id: "music",
    //   title: "Music Playlist",
    //   description: "Keep track of your favorite songs.",
    //   backgroundImage: "/music-background.jpg",
    //   link: "/music",
    // },
    // {
    //   id: "series",
    //   title: "TV Series",
    //   description: "Track what you’ve watched and what’s next.",
    //   backgroundImage: "/series-background.jpg",
    //   link: "/series",
    // },
  ];