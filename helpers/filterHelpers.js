const ALLOWED_COMPANY_CODES = [2]

filterDepartureResults = (results) => {
  let filteredResults;
  filteredResults = results.filter(result => {
    return ALLOWED_COMPANY_CODES.includes(result.prijevoznik)
  });

  return filteredResults
}

filterLineRelationPriceListByRelations = (results, from, to) => {
  let filteredResults;
  filteredResults = results.filter(result => {
    return (parseInt(result.stanicaod) === parseInt(from) && parseInt(result.stanicado) === parseInt(to))
  })
  return filteredResults
}

exports.filterDepartureResults = filterDepartureResults
exports.filterLineRelationPriceListByRelations = filterLineRelationPriceListByRelations
