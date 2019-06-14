export const API_KEY = "1a7ecd5877449f246e10d262ef7a211d",
  API_TOKEN =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxYTdlY2Q1ODc3NDQ5ZjI0NmUxMGQyNjJlZjdhMjExZCIsInN1YiI6IjVkMDBmNTllYzNhMzY4MDg0NjFlYmI5MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.yaAlW5zr_i3BbYCWgWc27kl526i8iJY0ylXAY-NjxlQ",
  API_CALL =
    "https://api.themoviedb.org/3/movie/550?api_key=1a7ecd5877449f246e10d262ef7a211d";

const potter = d3.csv("./src/data/harry_potter.csv");

const rings = d3.json("./src/data/harry_potter.json");

// d3.json(`https://api.themoviedb.org/3/movie/550?api_key=${API_KEY}`).then(
//   res => {
//     console.table(res);
//   }
// );
Promise.all([potter, rings]).then(res => {
  console.table("Multiple req: ", res);
  console.table("Multiple req concat: ", [...res[0], ...res[1]]);
});
