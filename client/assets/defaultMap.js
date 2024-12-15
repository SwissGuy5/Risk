defaultMapJson = `{
    "mapName": "Default Risk Map",
    "continents": {
        "North America": {
            "troopReward": 5,
            "vertices": {
                "Alaska": ["NorthwestTerritory", "Alberta", "Kamchatka"],
                "NorthwestTerritory": ["Alaska", "Alberta", "Ontario", "Greenland"],
                "Greenland": ["Iceland", "Quebec", "NorthwestTerritory", "Iceland"],
                "Alberta": ["Alaska", "NorthwestTerritory", "Ontario", "WesternUnitedStates"],
                "Ontario": ["NorthwestTerritory", "Alberta", "Greenland", "Quebec", "WesternUnitedStates", "EasternUnitedStates"],
                "Quebec": ["Greenland", "Ontario", "EasternUnitedStates"],
                "WesternUnitedStates": ["Alberta", "Ontario", "EasternUnitedStates", "CentralAmerica"],
                "EasternUnitedStates": ["WesternUnitedStates", "Ontario", "Quebec", "CentralAmerica"],
                "CentralAmerica": ["WesternUnitedStates", "EasternUnitedStates", "Venezuela"]
            }
        },
        "South America": {
            "troopReward": 2,
            "vertices": {
                "Venezuela": ["CentralAmerica", "Peru", "Brazil"],
                "Peru": ["Venezuela", "Argentina", "Brazil"],
                "Brazil": ["Venezuela", "Peru", "Argentina", "NorthAfrica"],
                "Argentina": ["Peru", "Brazil"]
            }
        },
        "Africa": {
            "troopReward": 3,
            "vertices": {
                "NorthAfrica": ["Brazil", "Egypt", "EastAfrica", "Congo", "SouthernEurope", "WesternEurope"],
                "Egypt": ["NorthAfrica", "EastAfrica", "Congo", "SouthernEurope", "MiddleEast"],
                "EastAfrica": ["NorthAfrica", "Egypt", "SouthAfrica", "Madagascar", "MiddleEast"],
                "Congo": ["NorthAfrica", "EastAfrica", "SouthAfrica"],
                "SouthAfrica": ["EastAfrica", "Congo", "Madagascar"],
                "Madagascar": ["EastAfrica", "SouthAfrica"]
            }
        },
        "Europe": {
            "troopReward": 5,
            "vertices": {
                "Iceland": ["Scandinavia", "GreatBritian"],
                "Scandinavia": ["Iceland", "Ukraine", "GreatBritian", "NorthernEurope"],
                "Ukraine": ["Scandinavia", "NorthernEurope", "SouthernEurope", "Afghanistan", "Ural", "MiddleEast"],
                "GreatBritian": ["Iceland", "Scandinavia", "NorthernEurope", "WesternEurope"],
                "NorthernEurope": ["Scandinavia", "Ukraine", "GreatBritian", "SouthernEurope", "WesternEurope"],
                "SouthernEurope": ["NorthAfrica", "Egypt", "Ukraine", "NorthernEurope", "WesternEurope", "MiddleEast"],
                "WesternEurope": ["NorthAfrica", "GreatBritian", "NorthernEurope", "SouthernEurope"]
            }
        },
        "Oceania": {
            "troopReward": 2,
            "vertices": {
                "Indonesia": ["NewGuinea", "WesternAustralia", "Siam"],
                "NewGuinea": ["Indonesia", "WesternAustralia", "EasternAustralia"],
                "WesternAustralia": ["Indonesia", "NewGuinea", "EasternAustralia"],
                "EasternAustralia": ["NewGuinea", "WesternAustralia"]
            }
        },
        "Asia": {
            "troopReward": 7,
            "vertices": {
                "Siam": ["Indonesia", "India", "China"],
                "India": ["Siam", "China", "Afghanistan", "MiddleEast"],
                "China": ["Siam", "India", "Mongolia", "Siberia", "Afghanistan"],
                "Mongolia": ["China", "Japan", "Irkutsk", "Kamchatka", "Siberia", "Ural"],
                "Japan": ["Mongolia", "Kamchatka"],
                "Irkutsk": ["Mongolia", "Yakutsk", "Kamchatka", "Siberia"],
                "Yakutsk": ["Irkutsk", "Kamchatka", "Siberia"],
                "Kamchatka": ["Mongolia", "Japan", "Irkutsk", "Yakutsk"],
                "Siberia": ["China", "Mongolia", "Irkutsk", "Yakutsk", "Ural"],
                "Afghanistan": ["Ukraine", "India", "China", "Ural", "MiddleEast"],
                "Ural": ["Ukraine", "China", "Siberia", "Afghanistan"],
                "MiddleEast": ["Egypt", "EastAfrica", "Ukraine", "SouthernEurope", "India", "Afghanistan"]
            }
        }
    }
}`