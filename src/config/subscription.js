module.exports = [
  {
    type: "Silver",
    code: "silver",
    maxUsers: 3,
    maxTextTemplates: 3,
    maxVoiceMessage: null,
    pricePerYear: "99.99",
    pricePerMonth: "9.99",
    perks: {
      en: [
        "up to 3 users",
        "up to 3 text message templates",
        "unlimited voice messages",
      ],
      de: [
        "bis zu 3 Benutzer",
        "bis zu 3 Nachrichtenvorlagen",
        "unlimitierte Anzahl Srachnachrichten",
      ],
    },
  },
  {
    type: "Gold",
    code: "gold",
    pricePerYear: "149.99",
    pricePerMonth: "14.99",
    maxUsers: 5,
    maxTextTemplates: 5,
    maxVoiceMessage: null,
    perks: {
      en: [
        "up to 5 users",
        "up to 5 text message templates",
        "unlimited voice messages",
      ],
      de: [
        "bis zu 5 Benutzer",
        "bis zu 5 Nachrichtenvorlagen",
        "unlimitierte Anzahl Srachnachrichten",
      ],
    },
  },
  {
    type: "Platinum",
    code: "platinum",
    pricePerYear: "199.99",
    pricePerMonth: "19.99",
    maxUsers: 20,
    maxTextTemplates: 20,
    maxVoiceMessage: null,
    perks: {
      en: [
        "up to 20 users",
        "up to 20 text message templates",
        "unlimited voice messages",
      ],
      de: [
        "bis zu 20 Benutzer",
        "bis zu 20 Nachrichtenvorlagen",
        "unlimitierte Anzahl Srachnachrichten",
      ],
    },
  },
  {
    type: "Trial",
    code: "trial",
    pricePerYear: null,
    maxUsers: 20,
    maxTextTemplates: 20,
    maxVoiceMessage: null,
    pricePerMonth: "Free for the first 30 days",
    perks: {
      en: [
        "up to 20 users",
        "up to 20 text message templates",
        "unlimited voice messages",
      ],
      de: [
        "bis zu 20 Benutzer",
        "bis zu 20 Nachrichtenvorlagen",
        "unlimitierte Anzahl Srachnachrichten",
      ],
    },
  },
];
