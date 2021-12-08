async function handleYearlyData(deathData) {
  const yearlyDeaths = getYearlyCasualties(deathData)

  const margin = 75
  const height = 600
  const width = 600

  const yearExtent = d3.extent(yearlyDeaths, d => d.year)
  const xscale = d3.scaleLinear()
    .domain(yearExtent)
    .range([margin, height - margin])

  const casualtyCount = d3.extent(yearlyDeaths, d => d.count)
  const yscale = d3.scaleLinear()
    .domain(casualtyCount)
    .range([height - margin, margin])

  // line generator
  const linegen = d3.line()
    .x(d => xscale(d.year)) // Use date here! 
    .y(d => yscale(d.count))
    .curve(d3.curveLinear)

  // Select the svg
  const svg = d3
    .select('#yearly-deaths')

  // Make a group for the graph
  const graph = svg
    .append('g')

  // Draw the graph
  graph
    .append('path')
    .attr('d', linegen(yearlyDeaths))
    .attr('stroke-width', 5)
    .attr('stroke', '#d62124')
    .attr('fill', 'none')

  // Create the axis
  const bottomAxis = d3.axisBottom(xscale).tickFormat(d3.format("d"))
  const leftAxis = d3.axisLeft(yscale)

  // Append a group and add the bottom axis 
  svg
    .append('g')
    // Position the group
    .attr('transform', `translate(0, ${height - margin})`)
    // generate the axis in the group
    .call(bottomAxis)

  // Append the group and add the left axis
  svg
    .append('g')
    .attr('transform', `translate(${margin}, 0)`)
    .call(leftAxis)

  // create the graph title
  svg.append("text")
    .attr("x", (width / 2))
    .attr("y", 0 + (margin / 2))
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style('font-family', "'Roboto', sans-serif")
    .text("Innocent Deaths Caused by Police by Location")
    .text("Yearly Fatal Encounters with U.S. Police");
}

function getYearlyCasualties(data) {
  // save the death date column name
  const dateOfDeath = " Date of injury resulting in death (month/day/year)"

  // create parse format
  const parseTime = d3.timeParse('%m/%d/%Y')
  // parse the dates for d3
  data.forEach(d => d[dateOfDeath] = parseTime(d[dateOfDeath]))

  // Find the extents of the years in the dates
  let yearExtent = d3.extent(data, d => d[dateOfDeath].getFullYear())

  const yearlyDeaths = []

  for (person of data) {
    const deathYear = person[dateOfDeath].getFullYear()
    const index = deathYear - yearExtent[0]

    // If there is no entry for this year yet
    if (!yearlyDeaths[index]) {
      // create one
      yearlyDeaths[index] = { year: deathYear, count: 0 }
    }

    yearlyDeaths[index].count += 1
  }

  // slice to get all but the most recent year
  // the data for the most recent year (2021) is incomplete
  return yearlyDeaths.slice(0, yearlyDeaths.length - 1)
}