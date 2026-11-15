/* Team Smandych — site data.
 * Schedule transcribed from the current Gym Schedule page (screen recording, 15 Nov 2026).
 * The recording stops in the early evening, so every day carries a `tbcAfter` note:
 * classes after that time still have to be confirmed with the gym ([a confirmar]).
 * Times are 24h "HH:MM", Calgary local time.
 */
window.TS = {
  gym: {
    name: "Team Smandych Muay Thai & Kickboxing",
    address1: "#200 – 555 11 Ave SW",
    address2: "Calgary, AB T2R 1P6",
    landmark: "Downtown Calgary, above Singapore Sam's",
    phoneDisplay: "(403) 263-4357",
    phoneHref: "tel:+14032634357",
    emailTo: "info@teamsmandych.ca",
    emailCc: "tasmandych@shaw.ca",
    instagram: "https://www.instagram.com/teamsmandych/",
    directions: "https://www.google.com/maps/dir/?api=1&destination=555+11+Ave+SW+%23200,+Calgary,+AB+T2R+1P6",
    mapsSearch: "https://www.google.com/maps/search/?api=1&query=555+11+Ave+SW+%23200,+Calgary,+AB+T2R+1P6",
    // Mindbody site link not yet known — [a confirmar]
    mindbody: null,
    timeZone: "America/Edmonton"
  },

  // trial: shown as a free-trial option in the booking flow ([a confirmar] with the gym)
  classes: {
    "beginners":   { name: "Beginner's Muay Thai", level: "Beginners", trial: true,
                     blurb: "The starting point. Learn the punches, kicks, elbows and knees that every other class builds on." },
    "thai-pad":    { name: "Muay Thai Thai Pad Class", level: "All levels", trial: true,
                     blurb: "Partner drills on Thai pads. Open to all levels." },
    "cardio":      { name: "Cardio Kickboxing", level: "Fitness", trial: true,
                     blurb: "Kickboxing-based conditioning class." },
    "lunch-cardio":{ name: "Lunch Cardio Kickboxing", level: "Fitness", trial: true,
                     blurb: "Cardio kickboxing over the lunch hour." },
    "children":    { name: "Children's Muay Thai", level: "Kids", trial: true,
                     blurb: "Muay Thai for kids. Team Smandych trains ages 5 and up." },
    "teen":        { name: "Teen Muay Thai", level: "Teens", trial: true,
                     blurb: "Muay Thai for teenagers." },
    "technique":   { name: "Muay Thai Technique", level: null, trial: false, blurb: null },
    "morning":     { name: "Morning Muay Thai", level: "After 1 month of beginner classes", trial: false,
                     blurb: "Using the punches, kicks, elbows and knees learned in the beginner class, you work with a partner on the pads or the heavy bag for a challenging 45-minute high-intensity workout." },
    "fight-camp":  { name: "Muay Thai Fight Camp", level: "Fighters", trial: false, blurb: null },
    "advanced":    { name: "Advanced Muay Thai / Fighter's Training", level: "Advanced", trial: false, blurb: null },
    "sparring":    { name: "Muay Thai Sparring Class", level: "All levels", trial: false, blurb: null },
    "intro-sparring": { name: "Intro to Sparring", level: null, trial: false, blurb: null },
    "ladies-sparring":{ name: "Ladies Sparring", level: "Women", trial: false, blurb: null },
    "clinching":   { name: "Clinching", level: null, trial: false, blurb: null },
    "karate":      { name: "Karate", level: null, trial: false, blurb: null },
    "circuit":     { name: "Circuit Training", level: null, trial: false, blurb: null },
    "open-gym":    { name: "Open Gym", level: "Members", trial: false, openGym: true,
                     blurb: "Members have access to open gym hours as well as every class." },
    "closed":      { name: "Gym closed", closed: true }
  },

  // The 14 names listed on the current Class Descriptions page, in their order.
  classList: ["technique","lunch-cardio","cardio","ladies-sparring","intro-sparring","beginners",
              "teen","children","advanced","thai-pad","sparring","fight-camp","karate","clinching"],

  // 0 = Sunday … 6 = Saturday
  week: [
    { tbcAfter: "13:00", slots: [
      ["11:00","12:00","cardio"], ["12:00","13:00","technique"] ] },
    { tbcAfter: "18:30", slots: [
      ["09:00","10:00","open-gym"], ["10:00","11:00","open-gym"], ["11:00","12:00","thai-pad"],
      ["12:00","13:00","cardio"], ["13:30","16:30","closed"], ["16:30","17:30","open-gym"],
      ["17:30","18:30","beginners"], ["17:30","18:30","technique"] ] },
    { tbcAfter: "19:00", slots: [
      ["06:30","07:15","morning"], ["09:00","10:00","open-gym"], ["10:00","11:00","open-gym"],
      ["11:00","12:00","technique"], ["12:00","13:00","cardio"], ["13:30","16:30","closed"],
      ["16:30","17:30","open-gym"], ["17:30","19:00","fight-camp"] ] },
    { tbcAfter: "19:30", slots: [
      ["09:00","10:00","open-gym"], ["10:00","11:00","open-gym"], ["11:00","12:00","thai-pad"],
      ["12:00","13:00","beginners"], ["12:00","13:00","cardio"], ["13:30","16:30","closed"],
      ["16:30","17:30","open-gym"], ["17:30","18:30","technique"], ["18:30","19:30","cardio"] ],
      tbcNote: "Children's Muay Thai and later classes" },
    { tbcAfter: "19:00", slots: [
      ["06:30","07:15","morning"], ["09:00","10:00","open-gym"], ["10:00","11:00","open-gym"],
      ["11:00","12:00","technique"], ["12:00","13:00","cardio"], ["13:30","16:30","closed"],
      ["16:30","17:30","open-gym"], ["17:30","19:00","fight-camp"] ] },
    { tbcAfter: "19:30", slots: [
      ["09:00","10:00","open-gym"], ["10:00","11:00","open-gym"], ["11:00","12:00","thai-pad"],
      ["12:00","13:00","cardio"], ["13:30","16:30","closed"], ["16:30","17:30","open-gym"],
      ["17:30","18:30","technique"], ["18:30","19:30","cardio"] ] },
    { tbcAfter: "13:15", slots: [
      ["10:00","11:00","children"], ["10:00","11:00","circuit"], ["11:00","12:00","beginners"],
      ["11:00","12:00","technique"], ["12:00","13:00","teen"],
      ["12:00","13:00","clinching","Alternating Saturdays"],
      ["12:00","13:15","intro-sparring","Alternating Saturdays"],
      ["12:00","13:15","ladies-sparring","Alternating Saturdays"] ] }
  ],

  coaches: [
    { name: "Trevor “TNT” Smandych", role: "Co-founder",
      facts: ["60+ fights", "Pro record 26–5–2, 13 KOs", "8 professional titles"] },
    { name: "Nathan “Nasty Nate” Smandych", role: "Co-founder",
      facts: ["Former WKA World Champion"] },
    { name: "Darren Snell", role: "Instructor", facts: null }
  ]
};
