const { buildSchema } = require("graphql");


const schema = buildSchema(`
  type Hour {
    datetime: String
    temp: Float
    feelslike: Float
    humidity: Float
    precip: Float
    visibility: Float
    uvindex: Float
    icon: String
  }

  type Day {
    datetime: String
    tempmax: Float
    tempmin: Float
    feelslike: Float
    humidity: Float
    icon: String
    description: String
    sunset: String
    sunrise: String
    uvindex: Float
    visibility: Float
    precip: Float
    hours: [Hour]
  }

  type WeatherResponse {
    resolvedAddress: String
    timezone: String
    description: String
    days: [Day]
  }

  type Query {
    getWeather(placeLocation: String!): WeatherResponse
  }
`);

export default schema;
