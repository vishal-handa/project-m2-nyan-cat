function lives(life){
    let lifeDisplay=document.getElementById('score');
    lifeDisplay.innerText=`Score: ${life}`;
}

function lifeReset(){
    let life=3;
    return life;
}