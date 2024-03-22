const URL = 'http://localhost:3400/produtos'

let listaDeProdutos = [];
let btnAdicionar = document.querySelector('#btn-adicionar');
let tabelaProduto = document.querySelector('table>tbody');
let modalProduto = new bootstrap.Modal(document.getElementById('modal-produto'));
let modoEdicao = false;

let formModal = {
    titulo: document.querySelector('h4.modal-title'),
    id: document.querySelector("#id"),
    nome: document.querySelector("#nome"),
    quantidadeEstoque: document.querySelector("#quantidadeEstoque"),
    valor: document.querySelector("#valor"),
    dataCadastro: document.querySelector("#dataCadastro"),
    btnSalvar:document.querySelector("#btn-salvar"),
    btnCancelar:document.querySelector("#btn-cancelar")
}


btnAdicionar.addEventListener('click', () =>{
    modoEdicao = false;
    formModal.titulo.textContent = 'Adicionar Produto'
    limparModalProduto();
    modalProduto.show();
});

function obterProdutos(){
    fetch (URL,{
        method: 'GET',
        headers: {
            'Authorization' : obterToken()
        }
    })
    .then((response) => response.json())
    .then(produtos=> {
        listaDeProdutos= produtos;
        popularTabela(produtos)
    })
    .catch((erro)=>{});
}

obterProdutos();

function popularTabela(produtos){

    tabelaProduto.textContent = '';

    produtos.forEach(produto => {
        criarLinhaNaTabela(produto);
    });
}

function criarLinhaNaTabela(produto){

    let tr = document.createElement("tr");

    let tdId = document.createElement('td'); 
    let tdNome = document.createElement("td");
    let tdQuantidadeEstoque = document.createElement('td');
    let tdValor = document.createElement("td");
    let tdDataCadastro = document.createElement("td");
    let tdAcoes = document.createElement("td");

    tdId.textContent = produto.id;
    tdNome.textContent = produto.nome;
    tdQuantidadeEstoque.textContent = produto.quantidadeEstoque;
    tdValor.textContent = produto.valor;
    tdDataCadastro.textContent = new Date(produto.dataCadastro).toLocaleDateString();
    tdAcoes.innerHTML = `<button onclick="editarProduto(${produto.id})" class="btn">
                                Editar
                            </button>
                            <button onclick="excluirProduto(${produto.id})" class="btn">
                                Excluir
                        </button>`
    

    tr.appendChild(tdId);
    tr.appendChild(tdNome);
    tr.appendChild(tdQuantidadeEstoque);
    tr.appendChild(tdValor);
    tr.appendChild(tdDataCadastro);
    tr.appendChild(tdAcoes);

    tabelaProduto.appendChild(tr);
}






formModal.btnSalvar.addEventListener('click', ()=>{

    let produto = obterProdutoDoModal();


    if(!produto.validar()){
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Nome e Quantidade Estoque são OBRIGATÓRIOS!",
          });
        return;
    }
    if(modoEdicao){
        atualizarProdutoNoBackend(produto);
    }else{
        adicionarProdutoNoBackend(produto);
    }
});
function atualizarProdutoNoBackend(produto){
    fetch(`${URL}/${produto.id}`, {
        method: "PUT",
        headers: {
            Authorization: obterToken(),
            "Content-Type": "application/json"
        },
        body: JSON.stringify(produto)
    })
    .then(() => {
        atualizarProdutoNaTabela(produto)
        Swal.fire({
            icon: 'success',
            title: `Produto ${produto.nome}, atualizado com sucesso!`,
            showConfirmButton: false,
            timer: 3000
        })

        modalProduto.hide();
    })
}
function atualizarProdutoNaTabela(produto){
    let indice =listaDeProdutos.findIndex(p => p.id == produto.id)

    listaDeProdutos.splice(indice, 1, produto);

    popularTabela(listaDeProdutos)
}

function obterProdutoDoModal(){
    return new Produto({
        id: formModal.id.value,
        nome : formModal.nome.value,
        quantidadeEstoque: formModal.quantidadeEstoque.value,
        valor: formModal.valor.value,
        dataCadastro: (formModal.dataCadastro.value)
            ? new Date(formModal.dataCadastro.value).toISOString()
            : new Date().toISOString()
    });
}

function adicionarProdutoNoBackend(produto){

    fetch(URL,{
        method:'POST',
        headers:{
            Authorization: obterToken(),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(produto)
    })
    .then(response=>response.json())
    .then(response=> {
        let novoProduto = new Produto(response);
        listaDeProdutos.push(novoProduto);

        popularTabela(listaDeProdutos);

        modalProduto.hide();
        Swal.fire({
            icon: 'success',
            title: `Produto ${produto.nome}, foi cadastrado com sucesso!`,
            showConfirmButton: false,
            timer: 3000
        })
    })
}

function limparModalProduto(){
    formModal.id.value = '';
    formModal.nome.value='';
    formModal.quantidadeEstoque.value='';
    formModal.valor.value='';
    formModal.dataCadastro.value='';
}
function editarProduto(id){
    modoEdicao = true;
    formModal.titulo.textContent = "Editar Produto";
    modalProduto.show();
    let produto = listaDeProdutos.find(p => p.id == id);

    atualizarModalProduto(produto)
    modalProduto.show();
}
function atualizarModalProduto(produto){
    formModal.id.value = produto.id;
    formModal.nome.value= produto.nome;
    formModal.quantidadeEstoque.value= produto.quantidadeEstoque;
    formModal.valor.value= produto.valor;
    formModal.dataCadastro.value= produto.dataCadastro.substring(0,10);
}
function excluirProduto(id){
    let produto = listaDeProdutos.find(produto => produto.id == id);

    if(confirm("Deseja realmente excluir o produto" + produto.nome)){
        excluirProdutoNoBackend(id);
    }
}

function excluirProdutoNoBackend(id){
    fetch(`${URL}/${id}`, {
        method:'DELETE', 
        headers:{
            Authorization: obterToken()
        }
    })
    .then(()=> {
        removerProdutoDaLista(id);
        popularTabela(listaDeProdutos);
    })
}

function removerProdutoDaLista(id){
    let indice = listaDeProdutos.findIndex(produto => produto.id == id);

    listaDeProdutos.splice(indice,1);
}