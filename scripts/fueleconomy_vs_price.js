
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
d3.csv("data/bike_sold_india.csv", function(data) {

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
      .text("Price")
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
    .text("Fuel Economy (kmpl)")
    .style("fill", "darkBlue")

  // Color scale: give me a specie name, I return a color
  var color = d3.scaleOrdinal()
    .domain(function(d){ return d.brand}  )
    .range(["LightSteelBlue","MediumOrchid","Fuchsia","IndianRed","GoldenRod","FireBrick","SlateBlue","OrangeRed","Teal","Indigo","Maroon","DarkMagenta","DarkOrchid","Peru","LightCoral","LightCyan","Plum","green","yellow","black"]);


    var tooltip = d3.select("body")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style('position', 'absolute')
      .style('z-index', '10')
      .style("background-color", "WhiteSmoke")
      .style("border", "solid")
      .style("border-color", "black")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px")


  // mouseover the specie that is hovered
  var mouseover = function(d){

    brand = d.brand

    tooltip
      .style("opacity", 1)

    d3.selectAll(".dot")
      .transition()
      .duration(10)
      .style("fill", "lighgrey")
      .attr("r", 5)

    d3.selectAll("." + brand)
      .transition()
      .duration(10)
      .style("fill", color(brand))
      .style("opacity", 0.7)
      .attr("r", 10)
  }

  // mouseover the specie that is hovered
  var mouseout = function(){
    d3.selectAll(".dot")
      .transition()
      .duration(10)
      .style("fill", "lighgrey")
      .attr("r", 5 )

      tooltip
        .transition()
        .duration(10)
        .style("opacity", 0)
  }

  var mousemove = function(d) {
    tooltip
      .html( `<div>Brand: <strong>${d.brand}</strong></div><div>Model: <strong>${d.name}</strong></div><div>Fueld economy: <strong>${d.kmpl}</strong></div>`)
      .style("left", (d3.mouse(this)[0]+90) + "px")
      .style("top", (d3.mouse(this)[1]) + "px")
  }




  // Add dots
  svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("class", function (d) { return "dot " + d.brand } )
      .attr("cx", function (d) { return x(d.ex_showroom_price); } )
      .attr("cy", function (d) { return y(d.kmpl); } )
      .attr("r", 5)
      .style("fill", function (d) { return color(d.brand) } )
      .style("opacity", 0.7)
      .on("mouseover", mouseover)
      .on("mouseleave", mouseout )
      .on("mousemove", mousemove )

});
