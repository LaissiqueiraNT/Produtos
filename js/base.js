function salvarToken(token){
    localStorage.setItem('token', token)
}
function obterToken(token){
   return localStorage.getItem("token");
}
function salvarUsuario(usuario){
   return localStorage.setItem('usuario', JSON.stringify(usuario));
}
function obterUsuario(usuario){
    let usuarioStore = localStorage.getItem("usuario");
    return JSON.parse(usuarioStore);
}
function sairDoSistema(){
    localStorage.removeItem('token'); 
    localStorage.removeItem('usuario');
    window.open('index.html', '_self');
}

function usuarioEstaLogado(){
    let token = obterToken();

    return token ? true : false;
}
function validaUsuarioAutenticado(){
    let logado = usuarioEstaLogado();
    if(window.location.pathname == '/index.html'){
        if(logado)
        window.open('controle-obterProdutos.html', '_self');
    } else {
        if(!logado){
            window.open('index.html', '_self')
        }
    }
}
validaUsuarioAutenticado();