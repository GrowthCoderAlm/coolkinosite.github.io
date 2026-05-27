fetch('header.html')
    .then(responce => responce.text())
    .then(data => {
        document.querySelector('.header-placeholder').outerHTML = data
    })
    .then(console.log('header успешно подгружен'))

fetch('subscribe.html')
    .then(responce => responce.text())
    .then(data => {
        document.querySelector('.subscribe-placeholder').outerHTML = data
    })
    .then(console.log('subscribe успешно подгружен'))

fetch('footer.html')
    .then(responce => responce.text())
    .then(data => {
        document.querySelector('.footer-placeholder').outerHTML = data
    })
    .then( console.log('footer успешно подгружен'))
   