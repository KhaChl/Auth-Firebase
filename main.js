/* registro de usuario */
const formRegistro = document.querySelector('#registrar-form');
formRegistro.addEventListener('submit', (e) => {
    e.preventDefault();
    const correo = document.querySelector('#registro-correo').value;
    const contraseña = document.querySelector('#registro-contraseña').value;
    /* autenticacion con firebase */
    firebase.auth().createUserWithEmailAndPassword(correo,contraseña)
        .then(userCredential => {
            formRegistro.reset();
            $('#registro-modal').modal('hide');
        /* captura de errores */
        }).catch(function(error){
            var errorCode = error.code;
            if (errorCode == 'auth/weak-password') {
                alert('La contraseña debe tener al menos 6 caracteres.');
            } else if (errorCode == 'auth/email-already-in-use') {
                alert('La dirección de correo electrónico ya está en uso por otra cuenta');
            }else if (errorCode == 'auth/invalid-email') {
                alert('La dirección de correo electrónico es invalida');
            }
        })
});

/* Ingresar usuario */
const formIngresar = document.querySelector('#ingresar-form');
formIngresar.addEventListener('submit', (e)=>{
    e.preventDefault();
    const correo = document.querySelector('#ingresar-correo').value;
    const contraseña = document.querySelector('#ingresar-contraseña').value;
    /* autenticacion con firebase */
    firebase.auth().signInWithEmailAndPassword(correo,contraseña)
        .then(userCredential => {
            formIngresar.reset();
            $('#ingresar-modal').modal('hide');
         /* captura de errores */
        }).catch(function(error){
            var errorCode = error.code;
            if (errorCode == 'auth/user-not-found') {
                alert('Usuario no existe.');
            } else if (errorCode == 'auth/wrong-password') {
                alert('Contraseña incorrecta.');
            }else if (errorCode == 'auth/invalid-email') {
                alert('La dirección de correo electrónico es invalida.');
            }
        })
});

/* ingresar con google */
const ingresarGoogle = document.querySelector('#ingresar-google');
ingresarGoogle.addEventListener('click', (e) => {
    e.preventDefault();
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
        .then(userCredential => {
            formIngresar.reset();
            $('#ingresar-modal').modal('hide');
        }).catch(error => {
            console.log(error);
        })
});

/* ingresar con facebook */
const ingresarFacebook = document.querySelector('#ingresar-facebook');
ingresarFacebook.addEventListener('click', (e) => {
    e.preventDefault();
    const provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithPopup(provider)
        .then(userCredential => {
            formIngresar.reset();
            $('#ingresar-modal').modal('hide');
        }).catch(error => {
            console.log(error);
        })
});

/* desconectar usuario */
const desconectar = document.querySelector('#desconectar');
desconectar.addEventListener('click', (e) => {
    e.preventDefault();
    firebase.auth().signOut ().then(() => {
    });
});

/* listar posts */
const listaPosts = document.querySelector('#posts');
const posts = data =>{
    if (data.length){
        let html = '';
        data.forEach(element => {
            const post = element.data();
            const li = `
                <li class="list-group-item list-group-item-action">
                    <h5>${post.titulo}</h5>
                    <p>${post.descripcion}</p>
                </li>
            `;
            html += li;
        });
        listaPosts.innerHTML = html;
    }else{
        listaPosts.innerHTML = '<p class="text-center">Ingrese para ver los post</p>';
    }
};

/* sesion */
firebase.auth().onAuthStateChanged(user => {
    if(user){
        firebase.firestore().collection('posts')
            .get()
            .then((snapshot) => {
                posts(snapshot.docs);
                ingresarCheck(user);
            });
    }else{
        posts([]);
        ingresarCheck(user);
    }
});

/* nav sesion */
const navIngresar = document.querySelectorAll('.nav-ingresar');
const navDesconectar = document.querySelectorAll('.nav-desconectar');
const ingresarCheck = user =>{
    if (user){
        navIngresar.forEach(link => link.style.display = 'none');
        navDesconectar.forEach(link => link.style.display = 'block');
    }else{
        navIngresar.forEach(link => link.style.display = 'block');
        navDesconectar.forEach(link => link.style.display = 'none');
    }
};