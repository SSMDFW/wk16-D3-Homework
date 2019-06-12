// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = { top: 20, right: 40, bottom: 60, left: 100 };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;
// Append a div to the body to create tooltips, assign it a class
var svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .attr("class", "tooltip")
  .style("opacity", 0);
// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

var Data = d3.csv("./assets/data/data.csv", function(err, Data) {
  if (err) throw err;

  Data.forEach(function(data) {

    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
  });
});
  // Create scale functions
var yLinearScale = d3.scaleLinear()
    .range([height, 0]);

var xLinearScale = d3.scaleLinear()
    .range([0, width]);

  // Create axis functions
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

  // Scale the domain
xLinearScale.domain([8, d3.max(Data, function(data) {
    return +data.poverty;
  })]);
yLinearScale.domain([0, d3.max(Data, function(data) {
    return +data.healthcare * 1.2;
  })]);

var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(data) {
      var abbrName = data.abbr;
      var povertyRate = +data.poverty;
      var lacksHealthcare = +data.healthcare;
      return (abbrName + "<br> Poverty Rate: " + povertyRate + "<br> Lacks Healthcare: " + lacksHealthcare);
    });
// Step 2: Create the tooltip in chartGroup.
chartGroup.call(toolTip);

var elem = chartGroup.append("g").selectAll("g")
    .data(Data)
    
var elemEnter =elem.enter()
      .append("g")
      .attr("transform", function (data, index) {
        return "translate(" + xLinearScale(data.poverty) + " ," + yLinearScale(data.healthcare) + ")"
      });
      elemEnter.append("circle")
        .attr("r", "15") 
        .attr("fill", "LightBlue")
        .on("click", function(data) {
        toolTip.show(data);
        })
        // onmouseout event
        .on("mouseout", function(data, index) {
        toolTip.hide(data);
        });
      elemEnter.append("text")
        //.attr("dx", function(data, index){return -12;})
        .attr("dy", function(data, index){return 5;})
        .attr("text-anchor", "middle")
        .text(function(data, index){return data.abbr;})     
        .attr("font-size", 12)  
        .attr('fill', 'white');

  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);
  
  chartGroup.append("g")
    .call(leftAxis);

  chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2)- 60)
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)");

// Append x-axis labels
  chartGroup.append("text")
    .attr("transform", "translate(" + (width / 2 - 25) + " ," + (height + margin.top + 30) + ")")
    .attr("class", "axisText")
    .text("In Poverty (%)");
