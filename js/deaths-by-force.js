async function handleForceData(deathData) {

  const data = getKillingsByForceUsed(deathData)

  const width = 700
  const height = 700

  const sizeExtent = d3.extent(data, d => parseFloat(d.count))
  const sizeScale = d3.scaleLinear()
    .domain(sizeExtent)
    .range([30, 150])

  const colorExtent = d3.extent(data, d => parseFloat(d.count))
  const colorScale = d3.scaleLinear()
    .domain(colorExtent)
    .range([0, 100])

  var circles = data.map((force) => {
    return {
      r: sizeScale(force.count),
      color: `hsl(37, ${colorScale(force.count)}%, 60%)`,
      text: force.key,
      value: force.count
    }
  })

  circles.sort((a, b) => b.r - a.r);

  d3.packSiblings(circles);

  // Select the SVG
  const svg = d3
    .select(`#deaths-by-force`)

  const forces = svg.append('g')
    .attr('transform', `translate(${width / 2},${height / 2.5})`)

  // force circles
  forces
    .append('g')
    .selectAll('circle.node')
    .data(circles)
    .enter()
    .append('circle')
    .classed('node', true)
    .attr('cx', d => d.x)
    .attr('cy', d => d.y)
    .attr('r', d => d.r)
    .attr('fill', d => d.color)

  // force labels
  forces
    .append('g')
    .selectAll('text.node')
    .data(circles)
    .enter()
    .append('text')
    .style('font-family', "'Roboto', sans-serif")
    .style('font-size', d => d.r / 3.2)
    .text(d => `${d.text.substring(0, 12)}`)
    .attr('text-anchor', 'middle')
    .attr('x', d => d.x)
    .attr('y', d => d.y)

  // force count labels
  forces
    .append('g')
    .selectAll('text.node')
    .data(circles)
    .enter()
    .append('text')
    .style('font-family', "'Roboto', sans-serif")
    .style('font-size', d => d.r / 3)
    .text(d => d.value)
    .attr('text-anchor', 'middle')
    .attr('x', d => d.x)
    .attr('y', d => (d.y + d.r / 4) + d.r / 4)

  // create the graph title
  svg.append("text")
    .attr("x", (width / 2))
    .attr("y", 45)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .style('font-family', "'Roboto', sans-serif")
    .text("U.S. Police Fatal Encounters By Highest Force Used")
}

function getKillingsByForceUsed(data) {
  const killingsByForce = {}
  const forceKey = "Highest level of force"

  for (person of data) {
    let forceUsed = person[forceKey] || 'Undetermined'

    // consider data inconsistency
    if (
      forceUsed === "Asphyxiation/Restrain" ||
      forceUsed === "Restrain/Asphyxiation" ||
      forceUsed === "Asphyxiation/Restrained"
    ) {
      // this one has the largest number of entries
      // so lets set all the different variations to this one
      forceUsed = "Asphyxiated/Restrained"
    }

    if (
      forceUsed === "Other"
    ) {
      forceUsed = "Undetermined"
    }

    // If there is no entry for this race yet
    if (!killingsByForce[forceUsed]) {
      // create one
      killingsByForce[forceUsed] = { key: forceUsed, count: 0 }
    }

    killingsByForce[forceUsed].count += 1
  }
  return Object.values(killingsByForce)
}