const margin = {top: 40, right: 50, bottom: 60, left: 100},
      width = 800 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;


// Visualization 1: Scatter Plot of Budget vs International Gross
const svg1 = d3.select("#viz1-scatter")
  .append("svg")
    .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

d3.csv("data/movies.csv").then(function(data) {
    
    // Clean data
    data.forEach(d => {
        d.budget = +d.budget;
        d.intgross = +d.intgross;
    });
    const cleanData = data.filter(d => !isNaN(d.budget) && !isNaN(d.intgross) && d.budget > 0 && d.intgross > 0);

    // X axis 
    const x = d3.scaleLinear()
      .domain([0, d3.max(cleanData, d => d.budget)])
      .range([ 0, width ]);
      
    svg1.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5).tickFormat(d => "$" + d/1000000 + "M"))
      .attr("font-size", "12px");

    svg1.append("text")
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", height + 40)
      .text("Budget (Millions)");

    // Y axis 
    const y = d3.scaleLinear()
      .domain([0, d3.max(cleanData, d => d.intgross)])
      .range([ height, 0]);
      
    svg1.append("g")
      .call(d3.axisLeft(y).ticks(5).tickFormat(d => "$" + d/1000000 + "M"))
      .attr("font-size", "12px");

    svg1.append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("y", -60)
      .attr("x", 0)
      .text("International Gross (Millions)");

    svg1.selectAll("text").style("fill", "#e0e0e0");
    svg1.selectAll(".domain, .tick line").style("stroke", "#e0e0e0");

    // Colors
    const color = d3.scaleOrdinal()
      .domain(["PASS", "FAIL"])
      .range(["#2ca02c", "#d62728"]); 

    // Draw dots
    svg1.append('g')
      .selectAll("dot")
      .data(cleanData)
      .join("circle")
        .attr("cx", d => x(d.budget) )
        .attr("cy", d => y(d.intgross) )
        .attr("r", 5)
        .style("fill", d => color(d.binary)) 
        .style("opacity", 0.6)
        .style("stroke", "white")
        
      // Tooltip Interactivity
      .on("mouseover", function(event, d) {
          d3.select(this).style("stroke", "black").style("opacity", 1).attr("r", 8);
          tooltip.transition().duration(200).style("opacity", .9);
          tooltip.html(`<strong>${d.title}</strong><br>
                        Budget: $${(d.budget/1000000).toFixed(1)}M<br>
                        Gross: $${(d.intgross/1000000).toFixed(1)}M<br>
                        Result: ${d.binary}`)
            .style("left", (event.pageX + 15) + "px")
            .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function(event, d) {
          d3.select(this).style("stroke", "white").style("opacity", 0.6).attr("r", 5); 
          tooltip.transition().duration(500).style("opacity", 0);
      });

    // Visualization 2: Bar Chart of Bechdel Test Categories

    const categoryRollup = d3.rollups(cleanData, v => v.length, d => d.clean_test);
    const barData = categoryRollup.map(d => ({ category: d[0], count: d[1] }));
    barData.sort((a, b) => b.count - a.count);

    const svg2 = d3.select("#viz2-bar")
      .append("svg")
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // X axis
    const x2 = d3.scaleBand()
      .domain(barData.map(d => d.category))
      .range([0, width])
      .padding(0.2); 

    svg2.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x2))
      .selectAll("text")
        .style("font-size", "14px")
        .style("text-transform", "capitalize") 
        .style("fill", "#e0e0e0"); 
    
    // Y axis
    const y2 = d3.scaleLinear()
      .domain([0, d3.max(barData, d => d.count)])
      .range([height, 0]);

    svg2.append("g")
      .call(d3.axisLeft(y2))
      .selectAll("text")
        .style("fill", "#e0e0e0");

    svg2.selectAll(".domain, .tick line").style("stroke", "#888888");

    svg2.append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("y", -50)
      .attr("x", 0)
      .style("fill", "#e0e0e0")
      .text("Number of Movies");
    
    // Color scale for bars
    const barColor = d3.scaleOrdinal()
      .domain(["ok", "men", "notalk", "nowomen"])
      .range(["#2ca02c", "#ff7f0e", "#d62728", "#9467bd"]); 

    let activeCategory = null;

    svg2.selectAll("mybar")
      .data(barData)
      .join("rect")
        .attr("x", d => x2(d.category))
        .attr("y", d => y2(d.count))
        .attr("width", x2.bandwidth())
        .attr("height", d => height - y2(d.count))
        .attr("fill", d => barColor(d.category))
        .attr("opacity", 0.8)
        .style("cursor", "pointer")

      // Click interactivity to filter scatter plot
      .on("click", function(event, d) {
        if (activeCategory === d.category) {
            activeCategory = null;
            svg2.selectAll("rect").attr("opacity", 0.8).style("stroke", "none");
            
            // Reset scatter plot to show all points
            d3.select("#viz1-scatter").selectAll("circle")
              .style("display", null) // Removes the 'none' restriction
              .transition().duration(200)
              .style("opacity", 0.6)
              .style("stroke", "white");
        } else {
            // Set the clicked category as active and update styles
            activeCategory = d.category;
            svg2.selectAll("rect")
              .attr("opacity", r => r.category === activeCategory ? 1 : 0.3)
              .style("stroke", r => r.category === activeCategory ? "white" : "none")
              .style("stroke-width", 2); // Highlight the selected category

            d3.select("#viz1-scatter").selectAll("circle")
              .style("display", circ => circ.clean_test === activeCategory ? null : "none") 
              .transition().duration(200)
              .style("opacity", circ => circ.clean_test === activeCategory ? 0.9 : 0)
              .style("stroke", circ => circ.clean_test === activeCategory ? "white" : "none"); 
        }
    })
      .on("mouseover", function(event, d) {
        // Highlight the bar on hover
          tooltip.transition().duration(200).style("opacity", .9);
          tooltip.html(`<strong>Category: ${d.category.toUpperCase()}</strong><br>
                        Total Movies: ${d.count}`)
            .style("left", (event.pageX + 15) + "px")
            .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function(event, d) {
          tooltip.transition().duration(500).style("opacity", 0);
      }); 

    // VISUALIZATION 3: THE TREND LINE

    const yearRollup = d3.rollup(cleanData, 
        v => {
            const total = v.length;
            const passed = v.filter(d => d.binary === "PASS").length;
            return (passed / total) * 100; 
        }, 
        d => d.year
    );

    const trendData = Array.from(yearRollup, ([year, pct]) => ({ year, pct }))
                           .sort((a, b) => a.year - b.year);

    const svg3 = d3.select("#viz3-trend")
      .append("svg")
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // X axis
    const x3 = d3.scaleLinear()
      .domain(d3.extent(trendData, d => d.year))
      .range([0, width]);

    svg3.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x3).tickFormat(d3.format("d")))
      .selectAll("text")
        .style("font-size", "14px")
        .style("fill", "#e0e0e0");
        
    // Y axis
    const y3 = d3.scaleLinear()
      .domain([0, 100])
      .range([height, 0]);

    svg3.append("g")
      .call(d3.axisLeft(y3).tickFormat(d => d + "%"))
      .selectAll("text")
        .style("fill", "#e0e0e0");

    svg3.selectAll(".domain, .tick line").style("stroke", "#888888");

    svg3.append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("y", -50)
      .attr("x", 0)
      .style("fill", "#e0e0e0")
      .text("Percentage Passing (%)");

    svg3.append("path")
      .datum(trendData)
      .attr("fill", "none")
      .attr("stroke", "#66b2ff") 
      .attr("stroke-width", 3)
      .attr("d", d3.line()
        .x(d => x3(d.year))
        .y(d => y3(d.pct))
      );
    // Add points to the line
    svg3.selectAll("myCircles")
      .data(trendData)
      .join("circle")
        .attr("fill", "#111111")
        .attr("stroke", "#66b2ff")
        .attr("stroke-width", 2)
        .attr("cx", d => x3(d.year))
        .attr("cy", d => y3(d.pct))
        .attr("r", 5)
        // Tooltip Interactivity
      .on("mouseover", function(event, d) {
          d3.select(this).attr("fill", "#ffffff").attr("r", 8);
          tooltip.transition().duration(200).style("opacity", .9);
          tooltip.html(`<strong>Year: ${d.year}</strong><br>Pass Rate: ${d.pct.toFixed(1)}%`)
            .style("left", (event.pageX + 15) + "px")
            .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function(event, d) {
          d3.select(this).attr("fill", "#111111").attr("r", 5);
          tooltip.transition().duration(500).style("opacity", 0);
      });

}).catch(function(error){
    console.error("Error loading the CSV file:", error);
});