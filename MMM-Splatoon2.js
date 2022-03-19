/**
 * Magic Mirror
 * Module: MMM-Splatoon2
 *
 * By Red-CS
 */

Module.register("MMM-Splatoon2", {
  // Default configs
  defaults: {
    turf: true, // Show Turf War rotations
    ranked: true, // Show Ranked rotations
    league: true, // Show League rotations
    updateInterval: 600, // Update every 10 minutes
    header: "Splatoon 2 Rotations"
  },

  start: () => {
    self = this

    setInterval(() => {
      self.updateDom()
    }, this.config.updateInterval)
  },

  getDom: () => {
    // Create initial div
    var wrapper = document.createElement("div")
    wrapper.id = "wrapper"

    // Main header
    var header = document.createElement("h4")
    header.innerHTML = this.config.header
    header.id = "header"

    wrapper.appendChild(header)

    // Send data and add to DOM
    this.getData(wrapper)

    return wrapper
  },

  getData: (wrapper) => {
    var self = this

    // XHTTPRequest agent
    const http = new XMLHttpRequest()

    http.onreadystatechange = () => {
      if (this.readyState != 4 || this.status != 200) return "Loading ... "

      // Handle request
      const response = JSON.parse(this.responseText)
      console.log(response)
      Log.log(response)

      // Pass response to make content
      self.createContent(response, wrapper)
    }

    // API call
    const baseURL = "https://splatoon2.ink/data/schedules.json"
    http.open("GET", baseURL, true)
    http.send()
  },

  createContent: () => {
    // Wraps the entire data section
    var rotations = document.createElement("div")
    rotations.id = "rotations"

    // Add Turf War
    if (this.config.turf) {
      var turf = document.createElement("div")
      // TODO: Add img

      let right = document.createElement("ul")
      right.appendChild(
        document.createElement("li").innerHTML(response.regular[0].stage_a.name)
      )
      right.appendChild(
        document.createElement("li").innerHTML(response.regular[0].stage_b.name)
      )

      turf.appendChild(right)
      rotations.appendChild(turf)
    }

    // Add Ranked
    if (this.config.ranked) {
      var ranked = document.createElement("div")
      // TODO: Add img

      let right = document.createElement("ul")
      right.appendChild(
        document.createElement("li").innerHTML(response.ranked[0].stage_a.name)
      )
      right.appendChild(
        document.createElement("li").innerHTML(response.ranked[0].stage_b.name)
      )

      ranked.appendChild(right)
      rotations.appendChild(ranked)
    }

    // Add League
    if (this.config.league) {
      var league = document.createElement("div")
      // TODO: Add img

      let right = document.createElement("ul")
      right.appendChild(
        document.createElement("li").innerHTML(response.regular[0].stage_a.name)
      )
      right.appendChild(
        document.createElement("li").innerHTML(response.regular[0].stage_b.name)
      )

      league.appendChild(right)
      rotations.appendChild(league)
    }
  },

  getStyles: () => {
    return ["MMM-Splatoon2.css"]
  }
})
