const submitDATA = async () => {
    let userNameDOM = document.querySelector('input[name=username]');
    let passwordDOM = document.querySelector('input[name=password]');
    let emailDOM = document.querySelector('input[name=email]');
    let firstNameDOM = document.querySelector('input[name=firstName]');
    let lastNameDOM = document.querySelector('input[name=lastName]');

    let userData = {
        username:userNameDOM.value,
        password:passwordDOM.value,
        email:emailDOM.value,
        firstName:firstNameDOM.value,
        lastName:lastNameDOM.value
    }

    console.log('submitDATA', userData)
    const response = await axios.post("http://localhost:4567/auth/register" , userData)
    console.log("response", response.data)
}