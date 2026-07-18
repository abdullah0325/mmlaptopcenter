(function () {
  if (
    typeof window === "undefined" ||
    !window.performance ||
    typeof window.performance.measure !== "function"
  ) {
    return;
  }

  var originalMeasure = window.performance.measure.bind(window.performance);

  if (window.performance.measure.__mmMeasureGuard) {
    return;
  }

  function withNonNegativeTimestamps(options) {
    if (!options || typeof options !== "object") {
      return options;
    }

    var nextOptions = options;

    if (typeof options.start === "number" && options.start < 0) {
      nextOptions = Object.assign({}, nextOptions, { start: 0 });
    }

    if (typeof options.end === "number" && options.end < 0) {
      nextOptions = Object.assign({}, nextOptions, { end: 0 });
    }

    if (
      typeof nextOptions.start === "number" &&
      typeof nextOptions.end === "number" &&
      nextOptions.end < nextOptions.start
    ) {
      nextOptions = Object.assign({}, nextOptions, { end: nextOptions.start });
    }

    return nextOptions;
  }

  function guardedMeasure(name, startOrOptions, endMark) {
    try {
      return originalMeasure(name, startOrOptions, endMark);
    } catch (error) {
      var message =
        error && typeof error.message === "string" ? error.message : "";

      if (message.indexOf("negative time stamp") === -1) {
        throw error;
      }

      if (startOrOptions && typeof startOrOptions === "object") {
        return originalMeasure(
          name,
          withNonNegativeTimestamps(startOrOptions),
          endMark
        );
      }

      if (typeof startOrOptions === "number" && startOrOptions < 0) {
        return originalMeasure(name, 0, endMark);
      }

      throw error;
    }
  }

  guardedMeasure.__mmMeasureGuard = true;
  window.performance.measure = guardedMeasure;
})();
