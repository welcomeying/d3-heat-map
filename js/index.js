d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json", function (error, data) {
	if (error) throw error;

	var dataset = data.monthlyVariance;
	var base = data.baseTemperature;
	var mon = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	var color = ["#2166ac", "#4393c3", "#92c5de", "#d1e5f0", "#fddbc7", "#f4a582", "#d6604d", "#b2182b"];
	var colorScale = d3.scaleQuantile().
	domain([0, 2, 4, 6, 8, 10, 12, 14]).
	range(color);

	// Set the dimensions of the canvas / graph
	var w = 1500;
	var h = 500;
	var margin = 150;

	var svg = d3.select("body").
	append("svg").
	attr("width", w + margin * 2).
	attr("height", h + margin * 2).
	append("g").
	attr("transform", "translate(" + margin + "," + margin + ")");

	// Add title and description
	svg.append("text").
	attr("id", "title").
	attr("x", w / 2).
	attr("text-anchor", "middle").
	attr("y", -50).
	text("Monthly Global Land-Surface Temperature").
	style("font-size", "30px");

	svg.append("text").
	attr("id", "description").
	attr("x", w / 2).
	attr("text-anchor", "middle").
	attr("y", -15).
	html("Base temperature: " + base + "&#8451").
	style("font-size", "20px");

	// Define tooltip
	var tooltip = d3.select("body").
	append("div").
	style("visibility", "hidden").
	attr("id", "tooltip");

	// Set the ranges
	var xScale = d3.scaleLinear().
	domain([d3.min(dataset, function (d) {return d.year;}), d3.max(dataset, function (d) {return d.year;})]).
	range([0, w]);

	var yScale = d3.scaleOrdinal().
	domain([].concat(mon, [""])).
	range([0, h / 12, 2 * h / 12, 3 * h / 12, 4 * h / 12, 5 * h / 12, 6 * h / 12, 7 * h / 12, 8 * h / 12, 9 * h / 12, 10 * h / 12, 11 * h / 12, h]);

	// Define and add the axes
	var xAxis = d3.axisBottom(xScale).ticks(30).tickFormat(d3.format('d'));
	var yAxis = d3.axisLeft(yScale).tickValues(mon);

	svg.append("g").
	attr("id", "x-axis").
	attr("transform", "translate(0," + h + ")").
	call(xAxis);

	svg.append("g").
	attr("id", "y-axis").
	attr("transform", "translate(" + 0 + "," + 0 + ")").
	call(yAxis).
	selectAll("text").
	attr("transform", "translate(0, 20)");

	svg.append('text').
	attr('transform', 'rotate(-90)').
	attr('x', -300).
	attr('y', -70).
	style('font-size', 18).
	text('Months');

	svg.append('text').
	attr('x', 700).
	attr('y', 540).
	style('font-size', 18).
	text('Years');

	// Add bars and tooltips
	svg.selectAll("rect").
	data(dataset).
	enter().
	append("rect").
	attr("class", "cell").
	attr("data-month", function (d) {return d.month - 1;}).
	attr("data-year", function (d) {return d.year;}).
	attr("data-temp", function (d) {return base + d.variance;}).
	attr("x", function (d) {return xScale(d.year) + 1;}).
	attr("y", function (d) {return yScale(d.month);}).
	attr("width", w / (d3.max(dataset, function (d) {return d.year;}) - d3.min(dataset, function (d) {return d.year;}))).
	attr("height", h / 12).
	style("fill", function (d) {return colorScale(base + d.variance);}).
	on("mouseover", function (d) {
		tooltip.style("visibility", "visible").
		attr("data-year", d3.select(this).attr("data-year")).
		html(d.year + ", " + mon[d.month - 1] + "<br>" + (base + d.variance).toFixed(2) + "&#8451").
		style("left", d3.event.pageX + 10 + "px").
		style("top", d3.event.pageY + "px");}).
	on("mouseout", function () {return tooltip.style("visibility", "hidden");});

	// Add legend
	var legend = svg.selectAll(".legend").
	data([0].concat(colorScale.quantiles())).
	enter().append("g").
	attr("id", "legend");

	legend.append("rect").
	attr("x", function (d, i) {return 30 * i;}).
	attr("y", -65).
	attr("width", 30).
	attr("height", 20).
	style("fill", function (d, i) {return color[i];});

	legend.append("text").
	text(function (d) {return d.toFixed(1);}).
	attr("x", function (d, i) {return 30 * i - 2;}).
	attr("y", -30).
	attr("font-size", "12px");

});