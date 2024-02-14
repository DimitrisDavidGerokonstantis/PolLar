//https://gist.github.com/tkon99/4c98af713acc73bed74c

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

export function generateName() {
  const name2 = [
    "Ziggy",
    "Floyd",
    "Led",
    "Rolling",
    "Stones",
    "Zeppelin",
    "Clash",
    "Ramones",
    "Punk",
    "JoyDivision",
    "Sioux",
    "NewWave",
    "Strummer",
    "Bowie",
    "Hendrix",
    "Beatles",
    "Doors",
    "Floyd",
    "Rolling",
    "Zep",
    "Sabbath",
    "Purple",
    "Queen",
    "Elvis",
    "Creedence",
    "Joplin",
    "Stones",
    "Zeppelin",
    "Clash",
    "Ramones",
    "Punk",
    "JoyDivision",
    "Sioux",
    "NewWave",
    "Strummer",
    "Bowie",
    "Hendrix",
    "Beatles",
    "Doors",
    "Floyd",
    "Rolling",
    "Zep",
    "Sabbath",
    "Purple",
    "Queen",
    "Elvis",
    "Creedence",
    "Joplin",
    "Stones",
    "Zeppelin",
    "Clash",
    "Ramones",
    "Punk",
    "JoyDivision",
    "Picassaur",
    "Mozartichoke",
    "VincentVanGoat",
    "Shakespeareat",
    "Beethovennui",
    "Dali-lama",
    "Monetella",
    "Chaplincoln",
    "Elvispider",
    "Lennonade",
    "VanGoghurt",
    "MonaLisaconstrictor",
    "Bachoon",
    "Salvadorable",
    "Galileoat",
    "Rembrandit",
    "Eltonjohnny",
    "FreudianSlippers",
    "MarilynMonroequito",
    "Frankensteinstein",
    "Michelangeltoad",
    "Matissecream",
    "Vivaldinosaur",
    "Cleopanthera",
    "AndyWarholrus",
    "Shakespearakeet",
    "DarthVaderdi",
    "RockyRoadrunner",
    "Picassnowman",
    "ChickJagger",
    "MonalisaFrankenstein",
    "Gandalfini",
    "Beethovenji",
    "Fridakahloven",
    "Houdinihedgehog",
    "Picassoap",
    "Bachacha",
    "Monetizer",
    "Dumbledorian",
    "Mickjaguar",
    "LudwigVanBeethoven",
    "Einsteinsect",
    "Rembrandolphin",
    "MarilynMonrolly",
    "VanGoghpickle",
    "Hitchcockroach",
    "Chopinoceros",
    "Elvisaurus",
    "Aristotleopard",
    "DjangoUnicorn",
    "Hitchcockatoo",
    "Salvadorable",
    "Monetball",
    "Galileopard",
    "Rembrandolphin",
    "LudwigVanBeethoven",
    "Chopinoceros",
    "Shakespearrot",
    "Mozartvark",
    "Eltonjohnny",
    "Chaplincorn",
    "Picassnowman",
    "Dali-lama",
    "MonaLizard",
    "VincentVanGoat",
    "Michelangeltoad",
    "DarthVaderdi",
    "MarilynMonrolly",
    "Beethovennui",
    "Shakespeareat",
    "RockyRoadrunner",
    "Fridakahloven",
    "Einsteinsect",
    "AndyWarholrus",
    "Monetizer",
    "Dumbledorian",
    "DjangoUnicorn",
    "Bachoon",
    "VanGoghurt",
    "Galileoat",
    "Vivaldinosaur",
    "Frankensteinstein",
    "Cleopanthera",
    "Houdinihedgehog",
    "Dali-lama",
    "Picassaur",
    "ChickJagger",
    "Salvadorable",
    "Rembrandit",
    "Lennonade",
    "Beethovenji",
    "Chaplincoln",
    "VanGoghpickle",
    "Hitchcockroach",
    "Elvisaurus",
    "Matissecream",
    "Aristotleopard",
    "MonalisaFrankenstein",
    "Shakespearakeet",
    "Michelangeltoad",
    "DarthVaderdi",
    "Chopinoceros",
    "Elvispider",
    "Bachacha",
    "Fridakahloven",
    "DjangoUnicorn",
    "Gandalfini",
    "Hitchcockatoo",
    "Dali-lama",
    "MonaLizard",
    "VincentVanGoat",
    "Shakespearrot",
    "Chaplincorn",
    "Monetball",
    "Galileopard",
    "Rembrandolphin",
    "LudwigVanBeethoven",
    "MarilynMonrolly",
    "ChickJagger",
    "Monetizer",
    "Eltonjohnny",
    "Bachoon",
    "Houdinihedgehog",
    "Dumbledorian",
    "Fridakahloven",
    "Einsteinsect",
    "AndyWarholrus",
    "DjangoUnicorn",
    "RockyRoadrunner",
    "Mozartvark",
    "Shakespearrot",
    "Chaplincoln",
    "Picassnowman",
    "Dali-lama",
    "MonaLizard",
    "VincentVanGoat",
    "Michelangeltoad",
    "DarthVaderdi",
    "MarilynMonrolly",
    "Beethovennui",
    "Shakespeareat",
    "Lennonade",
    "VanGoghurt",
    "Chaplinocorn",
    "MonalisaFrankenstein",
    "Gandalfini",
    "Hitchcockatoo",
    "Salvadorable",
    "Monetball",
    "Galileopard",
    "Rembrandolphin",
    "LudwigVanBeethoven",
    "ChickJagger",
    "Monetizer",
    "Eltonjohnny",
    "Houdinihedgehog",
    "Dumbledorian",
    "Fridakahloven",
    "Einsteinsect",
    "AndyWarholrus",
    "DjangoUnicorn",
    "Gandalfini",
    "RockyRoadrunner",
    "Mozartvark",
    "Picassnowman",
    "Chaplincoln",
    "Elvispider",
    "Lennonade",
    "Beethovenji",
    "ChickJagger",
    "MonaLisaFrankenstein",
    "Gandalfini",
    "VincentVanGoat",
    "Shakespearrot",
    "VanGoghurt",
    "Rembrandolphin",
    "Hitchcockroach",
    "Chopinoceros",
    "Elvisaurus",
    "Aristotleopard",
    "Dali-lama",
    "MonalisaFrankenstein",
    "MonaLizard",
    "Shakespearrot",
    "Chaplincorn",
    "Monetball",
    "VanGoghurt",
    "Dali-lama",
    "MarilynMonrolly",
    "Picassnowman",
    "ChickJagger",
    "Rembrandit",
    "Chaplinocorn",
    "LudwigVanBeethoven",
    "Fridakahloven",
    "Einsteinsect",
    "Dumbledore",
    "Mozartvark",
    "Beethovennui",
    "Houdinihedgehog",
    "DarthVaderdi",
    "Michelangeltoad",
    "AndyWarholrus",
    "Matissecream",
    "Vivaldinosaur",
    "Cleopanthera",
    "Monetizer",
  ];

  // Random Prefixes (Adjectives)
  const name1 = [
    "Whimsical",
    "Melodic",
    "Abstract",
    "Bardic",
    "Harmonious",
    "Surreal",
    "Colorful",
    "Witty",
    "Rocking",
    "Lyrical",
    "Starry",
    "Mysterious",
    "Symphonic",
    "Enigmatic",
    "Galactic",
    "Radiant",
    "Regal",
    "Psychoanalytic",
    "Playful",
    "Mad",
    "Artistic",
    "Painterly",
    "Orchestral",
    "Vivid",
    "Vibrant",
    "Dazzling",
    "Whiz-bang",
    "Jazzy",
    "Funky",
    "Groovy",
    "Zany",
    "Sonic",
    "Electric",
    "Eclectic",
    "Dynamic",
    "Quirky",
    "Dapper",
    "Wacky",
    "Cheerful",
    "Silly",
    "Droll",
    "Wondrous",
    "Fantastic",
    "Enchanting",
    "Crazy",
    "Spunky",
    "Daring",
    "Magical",
    "Clever",
    "Cunning",
    "Bizarre",
    "Daring",
    "Jubilant",
    "Blazing",
    "Vorpal",
    "Spiffy",
    "Bubbly",
    "Kooky",
    "Captivating",
    "Spectacular",
    "Breathtaking",
    "Astounding",
    "Phenomenal",
    "Sensational",
    "Peculiar",
    "Unusual",
    "Unicornic",
    "Mythical",
    "Legendary",
    "Enchanted",
    "Whizbang",
    "Eccentric",
    "Kaleidoscopic",
    "Doodle",
    "Sizzle",
    "Giggly",
    "Zesty",
    "Topsy-turvy",
    "Flamboyant",
    "Dizzying",
    "Jiggly",
    "Frolicsome",
    "Whoopee",
    "Befuddling",
    "Luminous",
    "Bamboozling",
    "Bewildering",
    "Bountiful",
    "Drooly",
    "Breathtaking",
    "Crackers",
    "Zippy",
    "Hilarious",
    "Epic",
    "Sparkling",
    "Zingy",
    "Bamboozling",
    "Jittery",
    "Breathtaking",
    "Screwy",
    "Awesome",
    "Wobble",
    "Ziggurat",
    "Wacky",
    "Jellybean",
    "Baffling",
    "Walloping",
    "Bouncing",
    "Snazzy",
    "Pizzazz",
    "Fizzing",
    "Quizzical",
    "Zoink",
    "Wiggly",
    "Zoological",
    "Fuzzy",
    "Jumbo",
    "Sizzling",
    "Whopping",
    "Snappy",
    "Doozy",
    "Majestic",
    "Swizzle",
    "Zoomorphic",
    "Puzzle",
    "Chuckle",
    "Drool",
    "Flummoxed",
    "Spectacular",
    "Bazinga",
    "Whirligig",
    "Gadzooks",
    "Jubilant",
    "Gobbledegook",
    "Brouhaha",
    "Hodgepodge",
    "Kerfuffle",
    "Lollygag",
    "Malarkey",
    "Noodle",
    "Nifty",
    "Outlandish",
    "Pandemonium",
    "Quibble",
    "Rambunctious",
    "Rigmarole",
    "Skedaddle",
    "Snollygoster",
    "Tricky",
    "Wobble",
    "Zephyr",
    "Gibberish",
    "Hullabaloo",
    "Higgledy-piggledy",
    "Hootenanny",
    "Higgledy-piggledy",
    "Hurly-burly",
    "Jamboree",
    "Kaleidoscope",
    "Lollygag",
    "Malarkey",
    "Noodle",
    "Nifty",
    "Outlandish",
    "Pandemonium",
    "Quibble",
    "Rambunctious",
    "Rigmarole",
    "Skedaddle",
    "Snollygoster",
    "Tricky",
    "Wobble",
    "Zephyr",
    "Gibberish",
    "Hullabaloo",
    "Higgledy-piggledy",
    "Hootenanny",
    "Higgledy-piggledy",
    "Hurly-burly",
    "Jamboree",
    "Kaleidoscope",
  ];

  var name =
    name1[getRandomInt(0, name1.length + 1)] +
    name2[getRandomInt(0, name2.length + 1)];
  return name;
}
