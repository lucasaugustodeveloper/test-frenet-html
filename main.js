const _cepSource = document.querySelector('input[name=cepSource]');
const _cepDestinary = document.querySelector('input[name=cepDestinary]');
const _weightPackage = document.querySelector('input[name=weightPackage]');
const _widthPackage = document.querySelector('input[name=widthPackage]');
const _heightPackage = document.querySelector('input[name=heightPackage]');
const _lengthPackage = document.querySelector('input[name=lengthPackage]');
const _informationDelivery = document.querySelector('#informationDelivery');
const _informationDeliveryGrid = document.querySelector('#informationDelivery .grid');
const btn = document.querySelector('#btn');

const api = axios.create({
  baseURL: 'https://frontend-test.frenet.dev/v1'
});

const templateQuotes = ({
  shippingServiceName,
  carrier,
  platformShippingPrice,
  deliveryTime,
  shippingCompetitorPrice
}) => (`
  <div className="card">
    <div className="card-body">
      <h5 className="card-title">${shippingServiceName}</h5>
      <p className="card-text">${carrier}</p>

      <ul className="list-group list-group-flush">
        <li className="list-group-item">
          <strong>Price of platform: </strong>
          R$ ${platformShippingPrice.toFixed(2)}
        </li>
        <li className="list-group-item">
          <strong>Delivery Time: </strong>
          ${deliveryTime}
        </li>
        <li className="list-group-item">
          <strong>Price of Competior: </strong>
          R$ ${shippingCompetitorPrice.toFixed(2)}
        </li>
      </ul>
    </div>
  </div>
`)

btn.addEventListener('click', (e) => {
  e.preventDefault();

  const transformValues = {
    zipCodeSource: _cepSource.value,
    zipCodeDestination: _cepDestinary.value,
    weight: Number(_weightPackage.value),
    dimension: {
      width: Number(_widthPackage.value),
      height: Number(_heightPackage.value),
      length: Number(_lengthPackage.value),
    }
  }

  for (const prop in transformValues) {
    if (transformValues[prop] === '') {
      alert('Fill all information');
      return false;
    }
  }
  
  api.post('/quote', transformValues)
  .then(({ data }) => {
    const { quotations } = data;
    
    _informationDelivery.classList.remove('hidden');

    quotations.forEach(item => {
        _informationDeliveryGrid.innerHTML += templateQuotes(item);
      })
    });
});
