Module.register("MMM-Splatoon2", {
  // Default module config.
  defaults: {
    turf: true, // Show Turf War rotations
    ranked: true, // Show Ranked rotations
    league: true, // Show League rotations
    updateInterval: 600000 // Update every 10 minutes
  },

  start: function () {
    var self = this

    this.sendSocketNotification("CONFIG", this.config)
    console.log("notification sent to node_helper")

    // Setting up interval for refresh
    setInterval(function () {
      self.updateDom()
    }, this.config.updateInterval)
  },

  // Override dom generator.
  getDom: function () {
    var wrapper = document.createElement("div")
    wrapper.id = "wrapper"
    wrapper.innerHTML = this.data.header

    this.sendSocketNotification("MMM_Splatoon2_ROTATIONS", {
      config: this.config,
      url: "https://splatoon2.ink/data/schedules.json"
    })

    return wrapper
  },

  getData: () => {
    // XHTTPRequest agent
    const http = new XMLHttpRequest()

    http.onreadystatechange = () => {
      if (http.readyState !== 4 || http.status !== 200) return "Loading ... "

      // Handle request
      const response = JSON.parse(http.responseText)
      Log.log(response)

      // Pass response to make content
      // self.createContent(response, wrapper)
      return response
    }

    // API call
    const baseURL = "https://splatoon2.ink/data/schedules.json"
    http.open("GET", baseURL, true)
    http.send()
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === "STARTED") {
      console.log("STARTED notification received from node_helper")
      this.config.text = "Started"
      this.updateDom()
    } else if (notification === "STARTED2") {
      console.log("STARTED2 notification received from node_helper")
      console.log(payload)
      // this.updateDom()
    }
  },

  createContent: (response, wrapper, config) => {
    // Wraps the entire data section
    var rotations = document.createElement("div")
    rotations.id = "rotations"

    // Add Turf War
    if (config.turf) {
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
    if (config.ranked) {
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
    if (config.league) {
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

    wrapper.appendChild(rotations)
  }
})
