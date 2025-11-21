import * as d3 from 'd3';

// Define data parser
const parseDate = d3.timeParse("%Y %b");

// Select the first SVG by its unique ID
const svg = d3.select("#article1-chart1-svg");

d3.csv('/Freya-professional-website-v1/series-211125.csv') 
    .then(d => {

        console.log("1. Raw Data Loaded:", d);
        
        // Data Conversion (using 'd' for the individual data point)
        d.forEach(d => {
            console.log("2. Converted Data:", d);
            d.Date = parseDate(d.Date);
            d["Inflation (%)"] = +d["Inflation (%)"];
        });

        // Create a filtered array containing only valid dates/numbers
        const validData = d.filter(d => 
            d.Date instanceof Date && 
            !isNaN(d.Date) && 
            !isNaN(d["Inflation (%)"])
        );
        
        console.log("3. Valid Data for Chart:", validData);

        // 1. Define margins/padding and dimensions
        const padding = 50;
        const w = parseInt(svg.attr("width"));
        const h = parseInt(svg.attr("height"));

        // 2. Define scales
        const xScale = d3.scaleTime()
            .domain(d3.extent(validData, dataPoint => dataPoint.Date))
            .range([padding, w - padding]);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(validData, dataPoint => dataPoint["Inflation (%)"])])
            .range([h - padding, padding]); // Invert range so greater Y values are higher up

        // 3. Define line generator constant
        const lineGenerator = d3.line()
            .x(dataPoint => xScale(dataPoint.Date)) // Map Date to X position
            .y(dataPoint => yScale(dataPoint["Inflation (%)"])); // Map Inflation to Y position
        
        // 4. Bind
        svg.selectAll(".time-path")
            .data([validData]) // Bind the entire dataset 'd' as a single data element
            .join("path")
            .attr("class", "time-path")
            .attr("fill", "none") // Ensure it doesn't fill
            .attr("stroke", "teal") // Set the line color
            .attr("stroke-width", 3)
            // Use the generator function to convert the data into the SVG 'd' path attribute
            .attr("d", lineGenerator);

        // 5. Define and position X Axis
        const xAxis = d3.axisBottom(xScale)
            .tickPadding(8);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", `translate(0, ${h - padding})`) // Move axis to the bottom
            .call(xAxis);

        // 6. Define and position Y Axis
        const yAxis = d3.axisLeft(yScale)
            .tickPadding(8);

        svg.append("g")
            .attr("class", "y axis")
            .attr("transform", `translate(${padding}, 0)`) // Move axis to the left padding line
            .call(yAxis);


    })
    .catch(error => {
		console.error("Error loading CSV:", error);
	});