

export class CurrencyService {
    static async getCurrencyFromCountry(countryCode) {
      const response = await fetch(`https://restcountries.com/v3.1/alpha?codes=${countryCode}`);
      if (response.status !== 200) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      const currency = data[0]?.currencies;
      const currencyCode = Object.keys(currency)[0];
      const currencyDetails = currency[currencyCode];
      return { currencyCode, currencyDetails };
    }
}
  