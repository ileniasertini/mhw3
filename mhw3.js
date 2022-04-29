let token_ricevuto;
const client_id='5babc8c5609b4aada2404fc27a9634c9';
const client_secret='67a2ae5b01844960bad42c6ca715b53f';



//con questa funzione genero un numero random
function getRandom(a) {
    return Math.floor(Math.random() * a);
}



//questa funzione genera inizialmente un numero tra 0 o 1, 
//che corrisponde rispettivamente all'aver perso o vinto 
//la possibilità di ottenere un album del cantante inserito.
//in caso di vittoria, viene mostrato un album, tra quelli prodotti dall'autore
//in caso di sconfitta, viene mostrata un'immagine con scritto "hai perso".
function onJsonCanzone(json) {
    console.log('STEP5_spotify--json funzione cerca');
    console.log(json);

    let valore=getRandom(2);
    console.log('STEP6_spotify--VITT/SCON-->'+valore);

    if(valore===1){ 
        const album_view=document.querySelector('#album_view');
        album_view.innerHTML='';
        
        const results=json.albums.items;
        let one_results= getRandom(results.length);
        console.log('STEP7_spotify--ALBUM_Nº-->'+one_results);

        const select_image=json.albums.items[one_results].images[0].url;
        const album_box=document.createElement('div');
        const img=document.createElement('img');
        img.className='img_spotify';
        img.src=select_image;
    
        album_box.appendChild(img);
        album_view.appendChild(album_box);
    }
    if(valore===0){
        const album_view=document.querySelector('#album_view');
        album_view.innerHTML='';

        const album_box=document.createElement('div');
        const img=document.createElement('img');
        img.src='HAIPERSO.png';
        img.classList.add('img_haiperso');
    
        album_box.appendChild(img);
        album_view.appendChild(album_box);
    }

   
}



function onResponseCanzone(rispostaa){
    console.log('STEP4_spotify--risposta funzione cerca');
    return rispostaa.json();
}



//con questa funzione cerco tutti gli album prodotti dal cantante inserito 
function cerca_album(event){
    event.preventDefault();
 
    const cantante_nome = document.querySelector('#cantante').value;
    const cantante_value= encodeURIComponent(cantante_nome);

    console.log('STEP3_spotify--Eseguo ricerca canzone');
    console.log('Authorization: Bearer ' + token_ricevuto)

    fetch('https://api.spotify.com/v1/search?type=album&q=' + cantante_value, 
    {
     headers: {
      'Authorization': 'Bearer ' + token_ricevuto.access_token
      }
    }
    ).then(onResponseCanzone).then(onJsonCanzone);
}



function onTokenJson(json){
    token_ricevuto=json;
    console.log(json)
    console.log('STEP2_spotify--json');
}



function onTokenSuccess(risposta){
    console.log('STEP1_spotify--risposta');
    console.log(risposta);
    return risposta.json();
}



//tramite ciò vado ad ottenre il mio token
fetch("https://accounts.spotify.com/api/token",
{
    method:"post",
    body: 'grant_type=client_credentials',
    headers:
    {
        'Content-Type':'application/x-www-form-urlencoded',
        'Authorization':'Basic '+ btoa(client_id+':'+client_secret)
    }
}
).then(onTokenSuccess).then(onTokenJson);



//quando clicco il pulsante cerca, si attiva la funzione cerca_album
const spotify=document.querySelector('#spotify_box');
spotify.addEventListener('submit', cerca_album);


//////////////////////////////////////////////////////////////////////////////

//con questa funzione verifico se l'email inserita è corretta 
function onJsonEmail(json){
    console.log("STEP_3_Email json ricevuto");

    const email_container = document.querySelector('#email_box');
    email_container.innerHTML = '';

    const validazione=json.deliverability;
    console.log("STEP_4_Email"+validazione);

    if(validazione==="DELIVERABLE"){
        const ok=document.querySelector('#email_okk');
        ok.classList.remove('class_email_ok');
        ok.classList.add('class_email_ok_2');
    }

    if(validazione==="UNDELIVERABLE"){
        const email_error=document.createElement('div');
        email_error.textContent="EMAIL NON VALIDA!";
        email_container.appendChild(email_error);
    } 
 
}



function onSuccessEmail(resp){
    console.log("STEP_2_Email");
    return resp.json();
}



//tale funzione rileva l'email inserita e la passa al fetch.
function identificazione(event){
    event.preventDefault();
    const email_input = document.querySelector('#email').value;
    console.log('STEP_1_Email ricevuta: ' + email_input);

    fetch("https://emailvalidation.abstractapi.com/v1/?api_key=ea8a0cbd96fb47028d9ecb2d59ae3c29&email="+email_input).then(onSuccessEmail).then(onJsonEmail);
}



//quando clicco il pulsante invia, si attiva la funzione identificazione
const email=document.querySelector('#email_box');
email.addEventListener('submit', identificazione);

