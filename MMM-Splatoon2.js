Module.register("MMM-Splatoon2", {
  // Default module config.
  defaults: {
    turf: true, // Show Turf War rotations
    ranked: true, // Show Ranked rotations
    league: true, // Show League rotations
    updateInterval: 600000, // Update every 10 minutes
    animationSpeed: 500, // Time to fade to next rotation
    animationDuration: 10000 // How long the screen will show a rotation
  },

  start: function () {
    // Log start
    Log.info("Starting module: " + this.name)
    this.sendSocketNotification("STARTUP", this.config)
    console.log("Startup notification sent to node_helper")

    // Set active rotation. Is used to loop through turf war, ranked, league
    this.activeRotation = 0

    this.sendSocketNotification("MMM_Splatoon2_ROTATIONS_REQUESTED", {
      url: "https://splatoon2.ink/data/schedules.json"
    })

    // TODO - Call set interval every two hours after rotations refresh

    // Setting up interval for refresh
    setInterval(() => {
      this.updateDom()
      this.sendSocketNotification("MMM_Splatoon2_ROTATIONS_REQUESTED", {
        url: "https://splatoon2.ink/data/schedules.json"
      })
    }, this.config.updateInterval)
  },

  // Override dom generator.
  getDom: function () {
    var wrapper = document.createElement("div")
    wrapper.id = "wrapper"

    // Skip below code on initial DOM render
    if (typeof this.rotationData === "undefined") return wrapper

    if (this.activeRotation >= this.rotationData.length) this.activeRotation = 0

    wrapper.innerHTML = `
    <h1>${this.rotationData[this.activeRotation].battleType} - ${
      this.rotationData[this.activeRotation].battleMode
    }</h1>
    <span>
      <img src=${this.rotationData[this.activeRotation].stage_a_img} id="" />
      <img src=${this.rotationData[this.activeRotation].stage_b_img} id="" />
    </span>
    `
    return wrapper
  },

  // Handle socket notification from node_helper
  socketNotificationReceived: function (notification, payload) {
    // Recieved Startup
    if (notification === "STARTUP") {
      console.log("Statup notification received from node_helper")
    }

    // Recieved Rotations
    else if (notification === "MMM_Splatoon2_ROTATIONS_RECEIVED") {
      console.log("Rotation notification received from node_helper")
      clearInterval(this.timer)
      this.timer = null
      this.formatData(payload)
      this.scheduleUpdateInterval()
    }
  },

  // Schedule visual up
  scheduleUpdateInterval: function () {
    // REVIEW - Look into using setTimeout instead

    this.updateDom(this.config.animationSpeed)
    this.activeRotation++

    this.timer = setInterval(() => {
      this.updateDom(this.config.animationSpeed)
      if (this.activeRotation === this.rotationData.length) {
        this.activeRotation = 0
      } else this.activeRotation++
    }, this.config.animationDuration)
  },

  // Parses and formats Splatoon rotation data
  formatData: function (data) {
    const baseURL = "https://app.splatoon2.nintendo.net"
    this.rotationData = [
      {
        battleType: "Regular Battle",
        battleMode: data.regular[0].rule.name,
        stage_a_name: data.regular[0].stage_a.name,
        stage_a_img: baseURL + data.regular[0].stage_a.image,
        stage_b_name: data.regular[0].stage_b.name,
        stage_b_img: baseURL + data.regular[0].stage_b.image
      },
      {
        battleType: "Ranked Battle",
        battleMode: data.gachi[0].rule.name,
        stage_a_name: data.gachi[0].stage_a.name,
        stage_a_img: baseURL + data.gachi[0].stage_a.image,
        stage_b_name: data.gachi[0].stage_b.name,
        stage_b_img: baseURL + data.gachi[0].stage_b.image
      },
      {
        battleType: "League Battle",
        battleMode: data.league[0].rule.name,
        stage_a_name: data.league[0].stage_a.name,
        stage_a_img: baseURL + data.league[0].stage_a.image,
        stage_b_name: data.league[0].stage_b.name,
        stage_b_img: baseURL + data.league[0].stage_b.image
      }
    ]

    // TODO - Pop modes that the user does not want to see, specified from configurations
  },
  getStyles: () => {
    return ["MMM-Splatoon2.css"]
  }
})
