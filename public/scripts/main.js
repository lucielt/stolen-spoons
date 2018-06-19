/* RFER TO in-view.js */

//grad headers
//insert content of header in the sticky one

const header = document.querySelector('.header')
const desktopHeader = document.querySelector('.header-desktop')

desktopHeader.innerHTML = header.innerHTML;

inView('.header')
    //when header enter viewport hide the desktop header
    .on('enter', el => {
        desktopHeader.classList.remove('visible')
    })
    //when the header leave show it
    .on('exit', el => {
        desktopHeader.classList.add('visible')
    });

inView('.fade')
    //when header enter viewport hide the desktop header
    .on('enter', img => {
        img.classList.add('visible')
    })
    //when the header leave show it
    .on('exit', img => {
        img.classList.remove('visible')
    });



/* RFER TO tilt.js */

const images = document.querySelectorAll(".image");
VanillaTilt.init(images, {
    max: 25,
    speed: 400
});

/* REFER TO REGISTER BUTTON*/
const registerBtn = document.querySelector('.register-button')
registerBtn.addEventListener('click', event => {
    event.preventDefault()
    const frontEl = document.querySelector('.front')
    frontEl.classList.add('slide-up')
})

/* REFER TO STRIPE  */
// Create a Stripe client
const stripe = Stripe('pk_test_6pRNASCoBOKtIshFeQd4XMUh');

// Create an instance of Elements
const elements = stripe.elements();

// Custom styling can be passed to options when creating an Element.
// (Note that this demo uses a wider set of styles than the guide below.)
var style = {
  base: {
    color: '#32325d',
    lineHeight: '18px',
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: 'antialiased',
    fontSize: '16px',
    '::placeholder': {
      color: '#aab7c4'
    }
  },
  invalid: {
    color: '#fa755a',
    iconColor: '#fa755a'
  }
};

// Create an instance of the card Element
const card = elements.create('card', {style: style});

// Add an instance of the card Element into the `card-element` <div>
card.mount('#card-element');

// Handle real-time validation errors from the card Element.
card.addEventListener('change', function(event) {
  var displayError = document.getElementById('card-errors');
  if (event.error) {
    displayError.textContent = event.error.message;
  } else {
    displayError.textContent = '';
  }
});

// Handle form submission
const form = document.getElementById('payment-form');
var errorElement = document.getElementById('card-errors');

form.addEventListener('submit', function(event) {
  event.preventDefault();
  /* add processing class to our form to disableit when processing */
  form.classList.add('processing')

  stripe.createToken(card).then(function(result) {
      console.log();
    if (result.error) {
      // if error remove processing class to allow user to modify info
      form.classList.remove('processing')
      // Inform the user if there was an error

      errorElement.textContent = result.error.message;
    } else {
      // Send the token to your server
      stripeTokenHandler(result.token);
    }
  });
});

function stripeTokenHandler(token){
    // variable for token, name, email
    const stripe_token = token.id;
    const name = document.querySelector('#name').value
    const email = document.querySelector('#email').value

    //grab form action
    const url = form.getAttribute('action')
    // send the data off to the url using fetch
    // fetch without option as for jiffy exemple means get something
    // method by default is get


    fetch(url, {
        //fetch to post to our URL instead of get
        method: 'POST',
        //sending via json data
        headers: {
            'Content-Type': 'application/json'
        },
        //send the data accross
        body: JSON.stringify({
                order:{
                    stripe_token,
                    name,
                    email
                }
        })
    })
    // with fetch we get back a response which we turn into json
        .then(response => response.json())
        //get it back as data to do stuff with
        .then(data => {
            //check if we actually get an order back and do somethg
            if(data.order){
                //const order = data.order;
                form.querySelector('.form-title').textContent = 'Payment successfull'
                form.querySelector('.form-fields').textContent =`Thank you ${name}, your payment was successfull and we sent an email receipt to ${email}`
                form.classList.remove('processing')
            }
        })
        // if error do something
        .catch(error => {
            errorElement.textContent = `There was an error with your payment, please try again or contact us at help@try.com`
            form.classList.remove('processing')
            console.log(error)
        })

    console.log('allo', stripe_token, name, email)
    //
}


/* smooth scrolling to anchor */

const anchors = document.querySelectorAll('a');

anchors.forEach(anchor => {
    anchor.addEventListener('click', event => {
        const href = anchor.getAttribute('href');
        if(href.charAt(0) === '#') {
            event.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    })
})
