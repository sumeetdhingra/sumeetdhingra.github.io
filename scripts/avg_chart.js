// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 100, left: 60},
    width = 1800 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("data/bike_sold_india_avg_data.csv", function(data) {

  // Add X axis
  var x = d3.scaleLinear()
    .domain([0, 500000, 200000,1300000])
    .range([ 0, width*7/5, width*3/5, width ]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));
  svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", width/2 + margin.left)
    .attr("y", height + margin.top + 50)
    .text("Price Range")
    .style("fill", "darkBlue");

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 100])
    .range([ height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));
  svg.append("text")
  .attr("text-anchor", "end")
  .attr("transform", "rotate(-90)")
  .attr("y", -margin.left + 20)
  .attr("x", -margin.top - height/2 + 20)
  .text("Average Fuel Economy (kmpl)")
  .style("fill", "darkBlue");


  // Add a scale for bubble size
  var z = d3.scaleLinear()
    .domain([0, 300])
    .range([ 10, 80]);

  // Add a scale for bubble color
  var myColor = d3.scaleOrdinal()
    .domain(function(d){ return d.brand}  )
    .range(["#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd","#8c564b","#e377c2","#7f7f7f","#bcbd22","#17becf"]);

  // -1- Create a tooltip div that is hidden by default:
  var tooltip = d3.select("body")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style('position', 'absolute')
      .style('z-index', '10')
      .style("background-color", "WhiteSmoke")
      .style("border-radius", "5px")
      .style("border-color", "black")
      .style("padding", "10px")
      .style("color", "black")

  // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
  var mouseover = function(d) {
    tooltip
      .transition()
      .duration(1)
    tooltip
      .style("opacity", 1)
      .html("Brand: " + d.brand)
      .style("left", (d3.mouse(this)[0]+30) + "px")
      .style("top", (d3.mouse(this)[1]+30) + "px")
  }
  var mousemove = function(d) {
    tooltip
      .html( `<div>Brand: <strong>${d.brand}</strong></div><div>Avg KMPL: <strong>${d.avg_kmpl}</strong></div><div>Avg Price: <strong>${d.avg_price}</strong></div><div>Units Sold: <strong>${d.items}</strong></div>`)
      .style("left", (d3.mouse(this)[0]+30) + "px")
      .style("top", (d3.mouse(this)[1]+30) + "px")
  }
  var mouseout = function(d) {
    tooltip
      .transition()
      .duration(1)
      .style("opacity", 0)
  }

  // Add dots
  svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("class", "bubbles")
      .attr("cx", function (d) { return x(+d.avg_price); } )
      .style("font-size","12px")
      .attr("cy", function (d) { return y(+d.avg_kmpl); } )
      .attr("r", function (d) { return z(+d.items); } )
      .style("fill", function (d) { return myColor(d.brand); } )
    // -3- Trigger the functions
    .on("mouseover", mouseover )
    .on("mousemove", mousemove )
    .on("mouseleave", mouseout )

  });
