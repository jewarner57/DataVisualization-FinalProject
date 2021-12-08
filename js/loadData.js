async function loadData() {
  const deathData = await d3.csv("./data/Innocent Deaths caused by Police (All time).csv")

  createZoomableMap(deathData)
  handleYearlyData(deathData)
  handleRaceData(deathData, "deaths-by-race", getKillingsByRace)
  handleForceData(deathData)
  handleStateData(deathData)
  handleCityData(deathData)

  const wheel = document.getElementById("loading-wheel")
  wheel.style.display = 'none'
}

loadData()
