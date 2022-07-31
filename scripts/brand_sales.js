// set the dimensions and margins of the graph
var margin = {top: 100, right: 20, bottom: 100, left: 40},
    width = 1800 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// set the ranges
var x = d3.scaleBand()
          .range([0, width])
          .padding(0.1);
var y = d3.scaleLinear()
          .range([height, 0]);


// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");


var tooltip = d3
    .select('body')
    .append('div')
    .attr('class', 'd3-tooltip')
    .style('position', 'absolute')
    .style('z-index', '10')
    .style('visibility', 'hidden')
    .style('padding', '10px')
    .style('background', 'rgba(0,0,0,0.6)')
    .style('border-radius', '4px')
    .style('color', '#fff')
    .text('a simple tooltip');

// get the data
d3.csv("data/bike_sold_india.csv", function(error, data) {
  if (error) throw error;

  // format the data
//  data.forEach(function(d) {
//    d.brand = +d.sales;
//  });

var nested_data = d3.nest()
.key(function(d) { return d.brand; })
.rollup(function(leaves) { return leaves.length; })
.entries(data);

console.log(nested_data[0]);
console.log(data[0]);
  // Scale the range of the data in the domains
  x.domain(nested_data.map(function(d) { return d.key; }));
  y.domain([0, d3.max(nested_data, function(d) { return +d.value; })]);

  // append the rectangles for the bar chart
  svg.selectAll(".bar")
      .data(nested_data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.key); })
      .attr("width", x.bandwidth())
      .attr("y", function(d) { return y(+d.value); })
      .text("heel")
      .attr("height", function(d) { return height - y(+d.value); })
      .text("heel")
      .on('mouseover', function (d, i) {
          tooltip
            .html(
              `<div>Brand: ${d.key}</div><div>Sales: ${d.value}</div>`
            )
            .style('visibility', 'visible');
          d3.select(this).transition().attr('fill', "#eec42d");
      })
      .on('mousemove', function () {
          tooltip
            .style('top', d3.event.pageY - 10 + 'px')
            .style('left', d3.event.pageX + 10 + 'px');
      })
      .on('mouseout', function () {
          tooltip.html(``).style('visibility', 'hidden');
          d3.select(this).transition().attr('fill', '#437c90');
      });

  // add the x Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.5em")
      .style("font-size","12px")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-65)");

  // add the y Axis
  svg.append("g")
      .call(d3.axisLeft(y));




});
