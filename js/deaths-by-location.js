createZoomableMap()

async function createZoomableMap() {
  const width = 1200;
  const height = 710;

  const zoom = d3.zoom()
    .scaleExtent([0.9, 50])
    .on("zoom", zoomed);

  const svg = d3.select('#deaths-by-location')
    .attr("viewBox", [0, 0, width, height])

  const g = svg.append("g");

  let detailDisplayOpen = false

  // start custom code 
  const deathData = await d3.csv("./data/Innocent Deaths caused by Police (All time).csv")

  const deathsLonExtent = d3.extent([-124.741409, -67.422941])
  const xscale = d3.scaleLinear()
    .domain(deathsLonExtent)
    .range([0, width])

  const deathsLatExtent = d3.extent([25, 48])
  const yscale = d3.scaleLinear()
    .domain(deathsLatExtent)
    .range([height, 0])

  const deaths = g.append('g')
    .selectAll('ellipse')
    .data(deathData)
    .enter()
    // add the circles
    .append('ellipse')
    .attr('cx', d => xscale(d["Longitude"]))
    .attr('cy', d => yscale(d["Latitude"]))
    .attr('rx', 3)
    .attr('ry', 3)
    .attr('fill', d => d["Gender"] === 'Male' ? '#4287f5' : '#d62124')
    .attr('opacity', () => 0.2)
    .on("mouseover", function (e) {
      detailDisplayOpen = true
      const { Name, Age, Gender, Race } = e.target.__data__
      const DateOfDeath = e.target.__data__[" Date of injury resulting in death (month/day/year)"]

      const data = { Name, Age, Gender, Race, DateOfDeath }

      const personDisplay = document.getElementById('person-display')
      personDisplay.replaceChildren()

      personDisplay.style.left = `${e.clientX}px`
      personDisplay.style.top = `${e.clientY}px`
      personDisplay.style.display = 'block'

      for (const [key, value] of Object.entries(data)) {
        const p = document.createElement('p')
        p.innerHTML = `${key}: ${value}`
        personDisplay.appendChild(p)
      }
    })
    .on("mouseleave", function (e) {
      detailDisplayOpen = false
      const personDisplay = document.getElementById('person-display')

      setTimeout(() => {
        if (!detailDisplayOpen) {
          personDisplay.style.display = 'none'
          personDisplay.replaceChildren()
        }
      }, 50)
    })

  const genderData = [{ color: '#4287f5', label: '= 1 Male', index: 0 }, { color: '#d62124', label: '= 1 Female', index: 1 }]
  const key = svg.append('g')
    .selectAll('circle')
    .data(genderData)
    .enter()
    .append('circle')
    .attr('cx', 40)
    .attr('cy', d => -200 + (d.index * 50))
    .attr('r', 20)
    .attr('fill', d => d.color)
    .attr('opacity', () => 0.2)

  const keyLabel = svg.append('g')
    .selectAll('text')
    .data(genderData)
    .enter()
    .append('text')
    .text(d => d.label)
    .attr('font-size', '30px')
    .attr('x', 70)
    .attr('y', d => -192 + (d.index * 50))
    .attr('fill', '#333')
    .attr('opacity', () => 0.7)

  // end custom code
  svg.call(zoom);

  function zoomed(event) {
    const { transform } = event;
    g.attr("transform", transform);
    g.attr("stroke-width", 1 / transform.k);
  }

  // create the graph title
  svg.append("text")
    .attr("x", (width / 2))
    .attr("y", -200)
    .attr("text-anchor", "middle")
    .style("font-size", "30px")
    .style('font-family', "'Roboto', sans-serif")
    .text("Innocent Deaths Caused by Police by Location")
}