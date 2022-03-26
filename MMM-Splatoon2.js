Module.register("MMM-Splatoon2", {
  // Default module config.
  defaults: {
    turf: true, // Show Turf War rotations
    ranked: true, // Show Ranked rotations
    league: true, // Show League rotations
    useGameModes: true, // Show game modes
    useSymbols: true, // Show the Turf War, Ranked, and League symbols
    useGrayScale: true, // Use grayscale images instead of color
    imageSize: 64, // Size of the images, in pixels REVIEW - Make String or Number
    updateInterval: 600000 // Update every 10 minutes
  },

  start: function () {
    var self = this

    this.sendSocketNotification("STARTUP", this.config)
    console.log("Startup notification sent to node_helper")

    // Setting up interval for refresh
    setInterval(function () {
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

  // Creates DOM elements given API response
  createContent: (response, config) => {
    // Wraps the entire data section
    var rotations = document.createElement("div")
    rotations.id = "rotations"

    var gameModes
    if (config.useGameModes) {
      gameModes = getGameModes(response)
    }

    // TODO Convert possible string imageSize value to number

    // Add Turf War
    if (config.turf) {
      var turf = document.createElement("div")
      turf.className = "row"

      if (typeof gameModes !== "undefined") {
        // Add game mode
        let left = document.createElement("h4")
        left.innerHTML = gameModes[0]
        turf.appendChild(left)
      }

      let right = document.createElement("ul")
      let stage_a = document.createElement("li")
      let stage_b = document.createElement("li")

      stage_a.innerHTML = response.regular[0].stage_a.name
      stage_b.innerHTML = response.regular[0].stage_b.name
      right.appendChild(stage_a)
      right.appendChild(stage_b)

      turf.appendChild(right)

      if (config.useSymbols) {
        let img = document.createElement("img")
        img.setAttribute(
          "src",
          `modules/MMM-Splatoon2/img/Turf${config.useGrayScale && "_GS"}.png`
        )
        img.setAttribute("width", "64px")
        img.setAttribute("height", "64px")

        turf.appendChild(img)
      }

      rotations.appendChild(turf)
    }

    // Add Ranked
    if (config.ranked) {
      var ranked = document.createElement("div")
      ranked.className = "row"

      if (typeof gameModes !== "undefined") {
        // Add game mode
        let left = document.createElement("h4")
        left.innerHTML = gameModes[1]
        ranked.appendChild(left)
      }

      let right = document.createElement("ul")
      let stage_a = document.createElement("li")
      let stage_b = document.createElement("li")

      stage_a.innerHTML = response.gachi[0].stage_a.name
      stage_b.innerHTML = response.gachi[0].stage_b.name

      right.appendChild(stage_a)
      right.appendChild(stage_b)

      ranked.appendChild(right)

      if (config.useSymbols) {
        let img = document.createElement("img")
        img.setAttribute(
          "src",
          `modules/MMM-Splatoon2/img/Ranked${config.useGrayScale && "_GS"}.png`
        )
        img.setAttribute("width", "64px")
        img.setAttribute("height", "64px")

        ranked.appendChild(img)
      }

      rotations.appendChild(ranked)
    }

    // Add League
    if (config.league) {
      var league = document.createElement("div")
      league.className = "row"

      if (typeof gameModes !== "undefined") {
        // Add game mode
        let left = document.createElement("h4")
        left.innerHTML = gameModes[2]
        league.appendChild(left)
      }

      // FIXME - Group ul and img in same div to fix spacing
      let right = document.createElement("ul")
      let stage_a = document.createElement("li")
      let stage_b = document.createElement("li")

      stage_a.innerHTML = response.league[0].stage_a.name
      stage_b.innerHTML = response.league[0].stage_b.name

      right.appendChild(stage_a)
      right.appendChild(stage_b)

      league.appendChild(right)

      if (config.useSymbols) {
        var img = document.createElement("img")
        img.setAttribute(
          "src",
          `modules/MMM-Splatoon2/img/League${config.useGrayScale && "_GS"}.png`
        )
        img.setAttribute("width", "64px")
        img.setAttribute("height", "64px")

        league.appendChild(img)
      }

      rotations.appendChild(league)
    }

    const wrapper = document.getElementById("wrapper")
    wrapper.appendChild(rotations)
  },

  getStyles: () => {
    return ["MMM-Splatoon2.css"]
  }
})

const getGameModes = (data) => {
  const gmArr = []

  // Append Turf War
  gmArr.push("TW")

  // Append Ranked
  gmArr.push(getGMInitials(data.gachi[0].rule.name))

  // Append League
  gmArr.push(getGMInitials(data.league[0].rule.name))

  return gmArr
}

const getGMInitials = (gameMode) => {
  // prettier-ignore
  switch(gameMode) {
    case "Clam Blitz": return "CM"
    case "Rainmaker": return "RM"
    case "Splat Zones": return "SZ"
    case "Tower Control": return "TC"
  }
}
