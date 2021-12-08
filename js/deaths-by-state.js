async function handleStateData(deathData) {
  const data = getKillingsByState(deathData)

  const width = 700
  const height = 700
  const margin = { x: 0, y: 10 }

  const sizeExtent = d3.extent(data, d => parseFloat(d.count))

  const sizeScale = d3.scaleLinear()
    .domain(sizeExtent)
    .range([18, 160])

  const colorExtent = d3.extent(data, d => parseFloat(d.count))
  const colorScale = d3.scaleLinear()
    .domain(colorExtent)
    .range([211, 0])

  var circles = data.map((state) => {
    return {
      r: sizeScale(state.count),
      color: `hsl(${colorScale(state.count)}, 50%, 50%)`,
      text: state.key,
      value: state.count
    }
  })

  circles.sort((a, b) => b.r - a.r);

  d3.packSiblings(circles);

  // Select the SVG
  const svg = d3
    .select(`#deaths-by-state`)

  const states = svg.append('g')
    .attr('transform', `translate(${width / 2},${height / 2})`)

  // State circles
  states
    .append('g')
    .selectAll('circle.node')
    .data(circles)
    .enter()
    .append('circle')
    .classed('node', true)
    .attr('cx', d => d.x)
    .attr('cy', d => d.y + margin.y)
    .attr('r', d => d.r)
    .attr('fill', d => d.color)

  // State abbreviation labels
  states
    .append('g')
    .selectAll('text.node')
    .data(circles)
    .enter()
    .append('text')
    .style('font-family', "'Roboto', sans-serif")
    .style('font-size', d => d.r)
    .text(d => d.text)
    .attr('text-anchor', 'middle')
    .attr('x', d => d.x)
    .attr('y', d => d.y + d.r / 5 + margin.y)

  // State count labels
  states
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
    .attr('y', d => (d.y + d.r / 4) + d.r / 3 + margin.y)

  // create the graph title
  svg.append("text")
    .attr("x", (width / 2))
    .attr("y", 25)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .style('font-family', "'Roboto', sans-serif")
    .text("Most Fatal Police Encounters By State")
}

function getKillingsByState(data) {
  killingsByState = {}

  for (person of data) {
    const state = person['State']

    // If there is no entry for this state yet
    if (!killingsByState[state]) {
      // create one
      killingsByState[state] = { key: state, count: 0 }
    }

    killingsByState[state].count += 1
  }

  return Object.values(killingsByState)
}