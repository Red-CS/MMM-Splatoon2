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

    this.sendSocketNotification("STARTUP", this.config)
    console.log("Startup notification sent to node_helper")

    // Setting up interval for refresh
    setInterval(function () {
      console.log("Interval")
      self.updateDom()
    }, this.config.updateInterval)
  },

  // Override dom generator.
  getDom: function () {
    var wrapper = document.createElement("div")
    wrapper.id = "wrapper"
    this.sendSocketNotification("MMM_Splatoon2_ROTATIONS_REQUESTED", {
      url: "https://splatoon2.ink/data/schedules.json"
    })

    return wrapper
  },

  socketNotificationReceived: function (notification, payload) {
    // Recieved Startup
    if (notification === "STARTUP") {
      console.log("STARTUP notification received from node_helper")
      this.updateDom()
    }

    // Recieved Rotations
    else if (notification === "MMM_Splatoon2_ROTATIONS_RECEIVED") {
      console.log("Rotation notification received from node_helper")
      this.createContent(payload, this.config)
    }
  },

  createContent: (response, config) => {
    console.log(response)
    // Wraps the entire data section
    var rotations = document.createElement("div")
    rotations.id = "rotations"

    // Add Turf War
    if (config.turf) {
      var turf = document.createElement("div")
      // TODO: Add img

      let right = document.createElement("ul")
      let stage_a = document.createElement("li")
      let stage_b = document.createElement("li")

      stage_a.innerHTML = response.regular[0].stage_a.name
      stage_b.innerHTML = response.regular[0].stage_b.name
      right.appendChild(stage_a)
      right.appendChild(stage_b)

      turf.appendChild(right)
      rotations.appendChild(turf)
    }

    // Add Ranked
    if (config.ranked) {
      var ranked = document.createElement("div")
      // TODO: Add img

      let right = document.createElement("ul")
      let stage_a = document.createElement("li")
      let stage_b = document.createElement("li")

      stage_a.innerHTML = response.gachi[0].stage_a.name
      stage_b.innerHTML = response.gachi[0].stage_b.name

      right.appendChild(stage_a)
      right.appendChild(stage_b)

      ranked.appendChild(right)
      rotations.appendChild(ranked)
    }

    // Add League
    if (config.league) {
      var league = document.createElement("div")
      // TODO: Add img

      let right = document.createElement("ul")
      let stage_a = document.createElement("li")
      let stage_b = document.createElement("li")

      stage_a.innerHTML = response.league[0].stage_a.name
      stage_b.innerHTML = response.league[0].stage_b.name

      right.appendChild(stage_a)
      right.appendChild(stage_b)

      league.appendChild(right)
      rotations.appendChild(league)
    }

    const wrapper = document.getElementById("wrapper")
    wrapper.appendChild(rotations)
  }
})
