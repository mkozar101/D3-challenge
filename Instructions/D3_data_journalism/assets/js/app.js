// Set height and width of svg element
var svgWidth = parseInt(d3.select('#scatter').style('width'), 10);
var svgHeight = 600;

// Append svg element to #scatter
var svg = d3.select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);


// Set margin for figure
var margin = {
    "top": 40,
    "bottom": 100,
    "right": 20,
    "left": 100,
}

// Back out chart width and height
var width = svgWidth - margin.right - margin.left;
var height = svgHeight - margin.top - margin.bottom;

// Create chart area
var chartGroup = svg.append("g")
    .attr("height", height)
    .attr("width", width)
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Pull in csv of data
d3.csv("assets/data/data.csv").then(function(data) {
    console.log(data);
    
    // Pull out data from csv
    y = data.map(d => parseFloat(d.healthcare));
    x = data.map(d => parseFloat(d.poverty));

    // get the extent of both x and y
    y_min_max = d3.extent(y);
    x_min_max = d3.extent(x);

    // Set x-scaling
    var xLinearScale = d3.scaleLinear()
      .domain([x_min_max[0]-2, x_min_max[1]])
      .range([0, width]);

    // Set y-scaling
    var yLinearScale = d3.scaleLinear()
      .domain([0, y_min_max[1]])
      .range([height, 0]);

    // Define axes
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Add axes to chartGroup
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // // Add circles to represent data points
    var circlesGroup = chartGroup.append("g")
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "stateCircle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "15")
        .attr("opacity", "8");


    // Add text over circles
    var textGroup = chartGroup.append("g")
        .selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "stateText")
        .text(d => d.abbr)
        .attr("x", d => xLinearScale(d.poverty)-2)
        .attr("y", d => yLinearScale(d.healthcare)+5);
    
    // Create axes labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0 - height / 2)
        .attr("y",0 - margin.left + 70)
        .attr("class", "aText")
        .text("Lacks Healthcare (%)");

    chartGroup.append("text")
        .attr("class", "axisText")
        .attr("transform", `translate(${width / 2}, ${height + margin.top})`)
        .text("In Poverty (%)");
    
  });
