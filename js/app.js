const criptomonedasSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

const objBusqueda= {
    moneda: '',
    criptomoneda: ''
};

//Crear un promise para las criptomonedas
const obtenerCriptomoneda = criptomonedas=> new Promise(resolve =>{
    resolve(criptomonedas);
});

document.addEventListener('DOMContentLoaded', ()=>{
    consultarCriptomonedas();

    formulario.addEventListener('submit', calcularPrecio);

    criptomonedasSelect.addEventListener('change', leerValor);

    monedaSelect.addEventListener('change', leerValor);
});

function consultarCriptomonedas(){
    const url = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD`;
    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => obtenerCriptomoneda(resultado.Data))
        .then(criptomonedas => selectCriptomonedas(criptomonedas));
};

function selectCriptomonedas(criptomonedas){
    criptomonedas.forEach(criptomoneda=>{
        const { FullName, Name} = criptomoneda.CoinInfo;
        const option = document.createElement('OPTION');
        option.textContent = FullName;
        option.value = Name;

        criptomonedasSelect.appendChild(option);
    });
};

function leerValor(e){
    objBusqueda[e.target.name] = e.target.value;
};


function calcularPrecio(e){
    e.preventDefault();

    //validar
    const {moneda, criptomoneda} = objBusqueda;
    if(moneda === '' || criptomoneda === ''){
        mostrarAlertas('Todos los campos son obligatorios');
        return;
    };

    //Consultar la API
    consultarAPI();
};

function mostrarAlertas(mensaje){
    const existeAlerta = document.querySelector('.existe-alerta');
    if(!existeAlerta){
        const alerta = document.createElement('DIV');
        limpiarHtml(alerta);
        alerta.classList.add('error', 'existe-alerta');
        alerta.textContent = mensaje;
    
        formulario.appendChild(alerta);
    
        setTimeout(()=>{
            alerta.remove();
        },3500);
    }
  
};

function consultarAPI(){
    const {moneda, criptomoneda} = objBusqueda;
    const url =`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;
    mostrarSpinner();

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(cotizacion => cotizarValor(cotizacion.DISPLAY[criptomoneda][moneda]));
};

function cotizarValor(cotizacion){
    limpiarHtml();
        const precio = document.createElement('P');
        const {PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE} = cotizacion;
        precio.classList.add('precio');
        precio.innerHTML =`El precio es: <span>${PRICE}</span>`;

        const precioAlto = document.createElement('P');
        precioAlto.innerHTML= `Precio más alto del día: <span>${HIGHDAY}</span>`;

        const precioBajo = document.createElement('P');
        precioBajo.innerHTML= `Precio más bajo del día: <span>${LOWDAY}</span>`;

        const ultimasHoras = document.createElement('P');
        ultimasHoras.innerHTML= `Variación de las ultimas 24 horas: <span>${CHANGEPCT24HOUR}%</span>`;

        const ultimaActualizacion = document.createElement('P');
        ultimaActualizacion.innerHTML= `Ultima actualización: <span>${LASTUPDATE}</span>`;

        resultado.appendChild(precio);
        resultado.appendChild(precioAlto);
        resultado.appendChild(precioBajo);
        resultado.appendChild(ultimasHoras);
        resultado.appendChild(ultimaActualizacion);
};

function limpiarHtml(){
    while(resultado.firstChild){
       resultado.removeChild(resultado.firstChild);
    };
};

function mostrarSpinner(){
    const spinner = document.createElement('DIV');
    limpiarHtml();
    spinner.classList.add('spinner');
    spinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    `;
    setTimeout(() => {
        spinner.remove();
    }, 3000);
    resultado.appendChild(spinner);
};