async function handleRaceData(svgID, getData) {
  const deathData = await d3.csv("./data/Innocent Deaths caused by Police (All time).csv")
  const data = getData(deathData)

  const width = 600
  const height = 600
  const margin = 70

  const pieGen = d3.pie()
  const arcData = pieGen(data.map((d) => d.count))

  const arcGen = d3.arc() // Make an arc generator
    .innerRadius(40) // Set the inner radius
    .outerRadius(200) // Set the outer radius
    .padAngle(0.001) // Set the gap between arcs

  // Make a scale to set the color 
  const colorScale = d3.scaleSequential()
    .domain([0, data.length])
    .interpolator(d3.interpolateRainbow);

  // Select the SVG
  const svg = d3
    .select(`#${svgID}`)

  // Append a group (<g>) to hold the arcs 
  const pieGroup = svg
    .append('g')
    // position the group in the center
    .attr('transform', `translate(${width / 2}, ${height / 2})`)

  const piePath = pieGroup
    .selectAll('path') // Select all paths
    .data(arcData) // Use the arc data 
    .enter()
    .append('path') // Make a path for each arc segment
    .attr('d', arcGen) // Draw the arc segement with the generator
    .attr('fill', (d, i) => colorScale(i)) // Use the color scale


  const labels = svg
    .append('g')

  labels
    .selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('r', '5')
    .attr('cx', 10)
    .attr('cy', (d, i) => (i * 20) + 15)
    .attr('fill', (d, i) => colorScale(i))

  labels
    .selectAll('text')
    .data(data)
    .enter()
    .append('text')
    .text(d => `${d.key}: ${d.count}`)
    .attr('x', 20)
    .attr('y', (d, i) => (i * 20) + 20)
}

function getKillingsByRace(data) {
  const killingsByRace = {}

  for (person of data) {
    const race = person['Race']

    // If there is no entry for this race yet
    if (!killingsByRace[race]) {
      // create one
      killingsByRace[race] = { key: race, count: 0 }
    }

    killingsByRace[race].count += 1
  }

  return Object.values(killingsByRace)
}

function getKillingsByForceUsed(data) {
  const killingsByForce = {}
  const forceKey = "Highest level of force"

  for (person of data) {
    const forceUsed = person[forceKey] || 'no data'

    // If there is no entry for this race yet
    if (!killingsByForce[forceUsed]) {
      // create one
      killingsByForce[forceUsed] = { key: forceUsed, count: 0 }
    }

    killingsByForce[forceUsed].count += 1
  }

  return Object.values(killingsByForce)
}

handleRaceData("deaths-by-race", getKillingsByRace)
// handleData("svg1", getKillingsByForceUsed)