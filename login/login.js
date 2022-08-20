const modalCad = {
	open() {
		document.querySelector('.modal-overlay-cad').classList.add('active');
		
    },
	close() {
		document.querySelector('.modal-overlay-cad').classList.remove('active');
        cadForm.clear();
    }
}

const cadStorage = {
    get() {
        const storedUserData = localStorage.getItem('dev.finances:cadUser')
        return storedUserData ? JSON.parse(storedUserData) : {}
    },
    set(dadosUser) {
        localStorage.setItem("dev.finances:cadUser", JSON.stringify(dadosUser))
    }
}

const cadForm = {
    getValues() {
        return {
            name: document.getElementById('cad_name').value,
            email: document.getElementById('cad_email').value,
            password: document.getElementById('cad_password').value,
        }
    },
    clear() {
        document.getElementById('cad_name').value = '';
        document.getElementById('cad_email').value = '';
        document.getElementById('cad_password').value = '';
    },
    submit() {
        const {name, email, password} = cadForm.getValues();

        if(name.trim() && email.trim() && password) {
            cadStorage.set(cadForm.getValues());
            alert("Cardastro Realizado com sucesso! Faça seu login!");
            modalCad.close();
        }else {
            alert("Preencha todos os campos!");
        }
    }
}

const loginForm = {
    getValues() {
        return {
            email: document.getElementById("login_email").value,
            password: document.getElementById("login_password").value,
        }
        
},
    submit() {
        const {email, password} = loginForm.getValues();
        const {email: storedEmail, password: storedPassword} = cadStorage.get();

        if(email === storedEmail && password === storedPassword) {
            localStorage.setItem("dev.finances:acesso", JSON.stringify(true));
            window.location.replace("./home.html");
        }else{
            alert("Usuário ou senha inválidos ou preencha todos os campos!");
        }
    }
}

function submitFormsListeners() {
    const loginFormElem = document.getElementById('login_form');
    const cadFormElem = document.getElementById('cad_form');

    loginFormElem.addEventListener('submit', e => {
        e.preventDefault();
        loginForm.submit(e);
    });

    cadFormElem.addEventListener('submit', e => {
        e.preventDefault();
        cadForm.submit(e);
    });
}
submitFormsListeners();