// SVG Size
let width = 700,
	height = 500;

// Load CSV file
d3.csv("data/wealth-health-2014.csv", d => {
	console.log(d);
	d.Income = +d.Income;
	d.LifeExpectancy = +d.LifeExpectancy;
	d.Population = +d.Population;

	return d;
}).then(data => {
	// Analyze the dataset in the web console
	console.log(data);
	console.log("Countries: " + data.length);

	drawChart(data);
});

function drawChart(data){
	let margin = {top: 40, right: 20, bottom: 40, left: 90},
		width = $('#chart-area').width() - margin.left - margin.right,
		height = 400 - margin.top - margin.bottom;

	let svg = d3.select("#chart-area").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// Create scales
	let incomeScale = d3.scaleLog()
		.domain([d3.min(data, d => d.Income), d3.max(data, d => d.Income)])
		.range([0, width])
		.nice();

	let lifeExpectancyScale = d3.scaleLinear()
		.domain([d3.min(data, d => d.LifeExpectancy), d3.max(data, d => d.LifeExpectancy)])
		.range([height, 0]);

	// Create color scale
	let colorScale = d3.scaleOrdinal(d3.schemeCategory10);

	// Create axes
	let xAxis = d3.axisBottom(incomeScale)
		.ticks(10, ".0s"); // Format ticks for logarithmic scale

	let yAxis = d3.axisLeft(lifeExpectancyScale);

	// Append x-axis
	svg.append("g")
		.attr("class", "x-axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

	// Append y-axis
	svg.append("g")
		.attr("class", "y-axis")
		.call(yAxis);

	// Add x-axis label
	svg.append("text")
		.attr("class", "x-axis-label")
		.attr("x", width / 2)
		.attr("y", height + 30)
		.attr("text-anchor", "middle")
		.text("Income");

	// Add y-axis label
	svg.append("text")
		.attr("class", "y-axis-label")
		.attr("x", -height / 2)
		.attr("y", -50)
		.attr("transform", "rotate(-90)")
		.attr("text-anchor", "middle")
		.text("Life Expectancy");

	// Add data points
	svg.selectAll("circle")
		.data(data)
		.enter()
		.append("circle")
		.attr("cx", d => incomeScale(d.Income))
		.attr("cy", d => lifeExpectancyScale(d.LifeExpectancy))
		.attr("r", d => Math.sqrt(d.Population) / 2000)  // Adjust radius factor to make circles smaller
		.attr("fill", d => colorScale(d.Region))
		.attr("opacity", 0.7);
}

