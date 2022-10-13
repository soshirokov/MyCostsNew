export const fetchCurrencyRate = (base: string, symbol: string) => {
  const myHeaders = new Headers()
  myHeaders.append('apikey', 'QgX6LYuNbIgfKoqlP7wuFAN02yqXWexc')

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
  }

  return fetch(
    `https://api.apilayer.com/fixer/latest?symbols=${symbol}&base=${base}`,
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => result.rates[symbol])
}
