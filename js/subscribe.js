const in_name = document.querySelector('#form-input-name') 
const in_mail = document.querySelector('#form-input-mail') 
const btn = document.querySelector('.subscribe_form-btn') 

btn.addEventListener('click', function(){
    event.preventDefault()

    if (!in_name.value)
    {
        in_name.classList.add('required')
    }
    else if (!in_mail.value)
    {
        in_name.classList.remove('required')
        in_mail.classList.add('required')
    }
    else
    {
        in_name.classList.remove('required')
        in_mail.classList.remove('required')
        console.log(
        `|---[System]---
        Пользователь ${in_name.value} занесён в базу подписчиков.
        Почта: ${in_mail.value}`)
    }
    
})