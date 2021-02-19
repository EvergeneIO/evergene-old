const Tool = require("../classes/Tool.js");

const moment = require("moment");

/**
 * Extend Moment.js
 * @author @ACertainCoder
 * @async
 */
module.exports = new Tool(
  {
    name: "Extend Moment",
    desc: "Erweitert Moment.js",
  },
  async function () {
    //Extend moment's locale object
    updateLocales();

    //Set default values for other methods
    setDefaults();

    //Let methods use the set default values
    useDefaults();
  }
);

/**
 * Update locales
 */
const updateLocales = function () {
  moment.updateLocale("de", {
    durationLabelsStandard: {
      S: "millisecond",
      SS: "milliseconds",
      s: "second",
      ss: "seconds",
      m: "minute",
      mm: "minutes",
      h: "hour",
      hh: "hours",
      d: "day",
      dd: "days",
      w: "week",
      ww: "weeks",
      M: "month",
      MM: "months",
      y: "year",
      yy: "years",
    },
    durationLabelsShort: {
      S: "ms",
      SS: "ms",
      s: "s",
      ss: "s",
      m: "m",
      mm: "m",
      h: "h",
      hh: "h",
      d: "d",
      dd: "d",
      w: "w",
      ww: "w",
      M: "mn",
      MM: "mn",
      y: "y",
      yy: "y",
    },
    durationTimeTemplates: {
      HMS: "h:mm:ss",
      HM: "h:mm",
      MS: "m:ss",
    },
    durationLabelTypes: [
      { type: "standard", string: "__" },
      { type: "short", string: "_" },
    ],
    durationPluralKey: function (token, integerValue, decimalValue) {
      //Singular for a value of `1`, but not for `1.0`.
      console.log(`dpk: ${integerValue} - ${decimalValue}`);
      if (integerValue === 1 && decimalValue === null) {
        console.log(token);
        return token;
      }

      console.log(token + token);
      return token + token;
    },
  });
};

/**
 * Set defaults
 */
const setDefaults = function () {
  //Set the locale
  moment.locale("en");

  //Set the formatters
  moment.defaultFormat = "dddd, Do MMMM YYYY [um] HH:mm:ss [Uhr]";
  moment.defaultDurationFormat = "d __, h __, m __, s __";
};

/**
 * Use defaults
 */
const useDefaults = function () {
  //Save the original duration formatter functions
  const durationsFormat = moment.duration.format;
  const durationFormat = moment.duration.fn.format;

  /**
   * durationsFormat
   * @param {Array<moment.Duration>} durations Durations
   * @param {string} template Template
   * @param {number} precision Precision
   * @param {Object<string, any>} settings Settings
   */
  moment.duration.format = function () {
    return durationsFormat.apply(
      this,
      arguments.length > 0
        ? arguments
        : [[moment.defaultDurationFormat], { trim: true }]
    );
  };

  /**
   * durationFormat
   * @param {string} template Template
   * @param {number} precision Precision
   * @param {Object<string, any>} settings Settings
   */
  moment.duration.fn.format = function () {
    return durationFormat.apply(
      this,
      arguments.length > 0
        ? arguments
        : [moment.defaultDurationFormat, { trim: true }]
    );
  };
};
