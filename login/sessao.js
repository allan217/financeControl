function encerrarSessao() {
    localStorage.setItem("dev.finances:acesso", false);
}

function validaSessao() {
    let acesso = localStorage.getItem("dev.finances:acesso");
    console.log(acesso)
    if(acesso == "false") {
        
        window.location.replace("./login.html")
    }
}