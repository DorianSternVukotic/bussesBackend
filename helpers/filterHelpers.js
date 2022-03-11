const ALLOWED_COMPANY_CODES = [2]

filterDepartureResults = (results) => {
  let filteredResults;
  filteredResults = results.filter(result => {
    return ALLOWED_COMPANY_CODES.includes(result.prijevoznik)
  });

  return filteredResults
}

exports.filterDepartureResults = filterDepartureResults
