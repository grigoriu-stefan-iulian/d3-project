// Type conversion.
const parseNA = string => (string === "NA" ? undefined : string);
const parseDate = string => d3.timeParse("%Y-%m-%d")(string);

function type(d) {
  const date = parseDate(d.release_date);
  return {
    budget: +d.budget,
    genre: parseNA(d.genre),
    genres: JSON.parse(d.genres).map(d => d.name),
    homepage: parseNA(d.homepage),
    id: +d.id,
    imdb_id: parseNA(d.imdb_id),
    original_language: parseNA(d.original_language),
    overview: parseNA(d.overview),
    popularity: +d.popularity,
    poster_path: parseNA(d.poster_path),
    production_countries: JSON.parse(d.production_countries),
    release_date: date,
    release_year: date.getFullYear(),
    revenue: +d.revenue,
    runtime: +d.runtime,
    tagline: parseNA(d.tagline),
    title: parseNA(d.title),
    vote_average: +d.vote_average,
    vote_count: +d.vote_count
  };
}
// Data utilities.
function filterData(data) {
  return data.filter(d => {
    return (
      d.release_year > 1999 &&
      d.release_year < 2010 &&
      d.revenue > 0 &&
      d.budget > 0 &&
      d.genre &&
      d.title
    );
  });
}

function prepareBarChartData(data) {
  const dataMap = d3.rollup(
    data, //Data
    v => d3.sum(v, leaf => leaf.revenue), // Reducer - takes array "v" and an accessor to sum up
    d => d.genre // Group by - Sort data by genre
  );

  const dataArray = Array.from(dataMap, d => ({ genre: d[0], revenue: d[1] }));

  return dataArray;
}

// Drawing utilities
const formatTicks = d => {
  return d3
    .format("~s")(d)
    .replace("M", "mil")
    .replace("G", "bil")
    .replace("T", "tril");
};

// Main function.
function ready(movies) {
  // Data prep.
  const moviesClean = filterData(movies);
  const barChartData = prepareBarChartData(moviesClean).sort((a, b) =>
    d3.descending(a.revenue, b.revenue)
  );

  //Margin convention
  const margin = { top: 80, right: 40, bottom: 40, left: 80 },
    width = 400 - margin.right - margin.left,
    height = 500 - margin.top - margin.bottom;

  //Scales
  const xMax = d3.max(barChartData, d => d.revenue);
  const xScale = d3.scaleLinear([0, xMax], [0, width]); //shorthand for .domain().range();
  const yScale = d3
    .scaleBand()
    .domain(barChartData.map(d => d.genre))
    .rangeRound([0, height])
    .paddingInner(0.35);

  // Draw base
  const svg = d3
    .select(".bar-chart-container")
    .append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Draw header
  const header = svg
    .append("g")
    .attr("class", "bar-header")
    .attr("transform", `translate(0, ${-margin.top / 2})`)
    .append("text");
  header
    .append("tspan")
    .text("Total revenue of movies")
    .style("font-size", "2rem")
    .style("fill", "white");
  header
    .append("tspan")
    .text("Since 1999")
    .attr("x", 0)
    .attr("dy", "2rem")
    .style("font-size", "1.5rem")
    .style("fill", "white");

  // Draw bars
  const bars = svg
    .selectAll(".bar")
    .data(barChartData)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("y", d => yScale(d.genre))
    .attr("width", d => xScale(d.revenue))
    .attr("height", yScale.bandwidth())
    .style("fill", "dodgerblue");

  // Draw axes.
  const xAxis = d3
    .axisTop(xScale)
    .tickFormat(formatTicks)
    .tickSizeInner(-height)
    .tickSizeOuter(0);
  const xAxisDraw = svg
    .append("g")
    .attr("class", "x axis")
    .call(xAxis);

  const yAxis = d3.axisLeft(yScale).tickSize(0);

  const YAxisDraw = svg
    .append("g")
    .attr("class", "y axis")
    .call(yAxis);
  YAxisDraw.selectAll("text").attr("dx", "-0.5rem");
}

// Load data.
d3.csv("./src/data/movies.csv", type).then(res => {
  ready(res);
});
