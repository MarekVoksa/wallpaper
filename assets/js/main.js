
settings.fakturoidAPIUrl = 'https://app.fakturoid.cz/api/v2';

// Set CSS variables from config

document.documentElement.style.setProperty( '--c-base', settings.color );
document.documentElement.style.setProperty( '--f-name', settings.fontName );
document.documentElement.style.setProperty( '--f-size', settings.fontSize );
document.documentElement.style.setProperty( '--clock-size', settings.clockSize );

let now,
  request,
  invoices,
  total;

// Clock module

if ( settings.enableClock ) {

  getAndSetTime();

  setInterval( 'getAndSetTime()', 1000 );

}

function getAndSetTime() {

  now = new Date();

  $( '.time' ).html( now.getHours() + ":" + now.getMinutes() );

  $( '.seconds' ).html( ( now.getSeconds() < 10 ? "0" : "" ) + now.getSeconds() );

}

// Fakturoid module

if ( settings.enableFakturoid ) {

  getAndSetInvoices();

  $( '.reload' ).click( () => {

    flushInvoices();

    getAndSetInvoices();

  });

} else {

  $( '.fakturoid' ).remove();

}

function flushInvoices() {

  $( '.invoices' ).empty();
  $( '.total-amount' ).empty();
  $( '.taxes-amount' ).empty();

}

function getAndSetInvoices() {

  request = new XMLHttpRequest();

  request.open( 'GET', settings.fakturoidAPIUrl + `/accounts/${settings.fakturoidSlug}/invoices.json` );

  request.setRequestHeader( "Authorization", "Basic " + btoa( `${settings.fakturoidEmail}:${settings.fakturoidAPIKey}` ) );

  request.onreadystatechange = () => {

    if ( request.readyState === 4 ) {

      invoices = JSON.parse( request.responseText );

      total = 0;

      for ( invoice of invoices ) {

        $( '.invoices' ).append(
          `<div class="invoice">
            <div class="date">${invoice.issued_on}</div>
            <div class="amount">${parseInt(invoice.native_total)} ${invoice.currency}</div>
          </div>`
        );

        total += parseInt( invoice.native_total );

      }

      $( '.total-amount' ).html( total + " " + invoices[0].currency );

      $( '.taxes-amount' ).html( ( total * settings.taxRate ) + " " + invoices[0].currency );

    }

  };

  request.send();

}
