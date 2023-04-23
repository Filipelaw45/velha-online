let velha = ['','','','','','','','','']
let gameOver = false
let player
const sequencias = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
]

function desenha() {
    const divVelha = document.getElementById('velha')
    divVelha.innerHTML = '';
    for (let i in velha) {
        const button = document.createElement('button');
        button.classList.add('btn-jogo');
        button.innerText = velha[i];
        button.addEventListener('click',()=>{
            if(button.innerText === ''){
                preenche(i)
                passaVez()
                desativaVelha()
            }
        })
        divVelha.appendChild(button);
    }
}

function preenche(i){
    velha[i] = player
    desenha()
}

function checaJogo(){
    for(let i in sequencias){
        if( velha[sequencias[i][0]] === 'X' &&
            velha[sequencias[i][1]] === 'X' &&
            velha[sequencias[i][2]] === 'X'){
                gameOver = true
                console.log('Jogo terminou venceu o jogador X 1')
                desativaVelha()
                break
            }
    }

    for(let i in sequencias){
        if( velha[sequencias[i][0]] === 'O' &&
            velha[sequencias[i][1]] === 'O' &&
            velha[sequencias[i][2]] === 'O'){
                gameOver = true
                console.log('Jogo terminou venceu o jogador O')
                desativaVelha()
            }
    }

    if(!velha.includes('') && !gameOver){
        console.log('deu empate')
        desativaVelha()
    }
}

function desativaVelha(){
    let btnVelha = document.querySelectorAll('.btn-jogo')
    for(let i in velha){
        btnVelha[i].disabled = true
    }   
}

function ativaVelha(){
    let btnVelha = document.querySelectorAll('.btn-jogo')
    for(let i in velha){
        btnVelha[i].disabled = false
    }   
}











const socket = io()
let btnNick = document.getElementById('btn-nick')
let inputNick = document.getElementById('nick')
let inputSala = document.getElementById('sala')
let btnSala = document.getElementById('btn-sala')
let btnEnviar = document.getElementById('enviar')
let inputMsg = document.getElementById('chat-input')
let chatContainer = document.getElementById('chat-container')


let salaOpts = {
    nick,
    sala
}

let msgOpts = {}

btnNick.addEventListener('click', function(){
    if(inputNick.value !== ''){
        salaOpts.nick = inputNick.value  
        inputNick.disabled = true
        btnNick.disabled = true
    }
})

btnSala.addEventListener('click', function(){
    if(inputNick.value !== ''){
        salaOpts.sala = inputSala.value  
        btnSala.disabled = true
        inputSala.disabled = true
        criarSala()
    }
})

btnEnviar.addEventListener('click', function(){
    msgOpts.msg = inputMsg.value 
    enviarMsg(msgOpts.msg)
    inputMsg.value = ''
})

function criarSala(){
    socket.emit('criar-sala', salaOpts)
}

function enviarMsg(msg){
    socket.emit('msg-de-sala', msg, salaOpts.sala, salaOpts.nick)
}   


function exibirMsg(nick, msg){
    let li = document.createElement('li')
    li.textContent = `${nick} diz: ${msg}`
    chatContainer.appendChild(li)
}

socket.on('msg', (msg, nick)=>{
    console.log(`Usuario ${nick} enviou a msg: ${msg}`);
    exibirMsg(nick, msg)
})

socket.on('jogador', (arg1, arg2)=>{
    if(arg1 === 'X'){
        player = arg1
        desenha()
        desativaVelha()
        console.log(player)
        console.log(arg1)
    }else{
        player = arg1
        desenha()
        desativaVelha()
        console.log(player)
        console.log(arg1)
    }
})

socket.on('comeca', ()=>{
    if(player === 'X') ativaVelha()
})

function passaVez(){
    socket.emit('passa-vez', velha, player)
}

socket.on('proximo', (jogada, pl)=>{
    velha = jogada
    if(player !== pl){
        desenha()
        ativaVelha()    
    }
    checaJogo()
})