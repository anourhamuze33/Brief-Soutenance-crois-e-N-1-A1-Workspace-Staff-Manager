let workers = [];

    const modal_assign = document.getElementById("modal_assign");
    const modal_info = document.getElementById("modal_info");
    const form_modal = document.getElementById("form_modal");


document.querySelector(".body").addEventListener("click", modalOpen);
function modalOpen(event) {
    const select = event.target.closest("[data-select]");
    if (!select) {
        return;
    }
    const data_select = select.dataset.select;



    switch (data_select) {
        case "add":
            form_modal.classList.remove("cache");
            break;
        case "selection":
            modal_info.classList.remove("cache");
            break;
        case "close":
            modal_assign.classList.add("cache");
            modal_info.classList.add("cache");
            form_modal.classList.add("cache");
            break;
    }
}
const workers_bar = document.querySelector(".staff_list")
const inputs = document.querySelectorAll(".inputs");

const formulaire = document.getElementById("worker_formulaire");
let conteur = 0;
 add_exp();
formulaire.addEventListener("submit", (e) => {
    form_validation();
    function form_validation() {
        e.preventDefault();
        // variable pour la sortie du fonction si l'input est inconvenable.
        let valide = true;
        // regex of validation form
        const img_regex = /^(https?:\/\/(?:www\.)?[a-zA-Z0-9\-._~:/?#\[\]@!$&'()*+,;=%]+?\.(?:png|jpe?g|gif|webp|svg))(?:\?.*)?$/;
        const name_regex = /^[A-Za-z0-9À-ÿ ,.'!?-]{3,50}$/
        const role_regex = /^[A-Za-z0-9À-ÿ ,.'!?-]{1,50}$/
        const email_regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
        const phone_regex = /^\+?[1-9]\d{0,2}[ \-]?\(?\d+\)?([ \-]?\d+)*$/
        //ensure that the input isn't empty
        for (const input of inputs) {
            if (input.value.trim() == "") {
                valide = false;
                input.value = "";
            };
        };
        //condition of regex
        if (!img_regex.test(inputs[2].value) ||
            !name_regex.test(inputs[0].value) ||
            !role_regex.test(inputs[1].value) ||
            !email_regex.test(inputs[3].value) ||
            !phone_regex.test(inputs[4].value)) {
            valide = false;
        }

        if (!valide) {
            return;
        }
        const [valid_exp, exps]=validate_experiences();
        if (!valid_exp) {
        alert("input of experiences s not valide.");
       return;
}

        if (valide) {
            conteur++;
            const worker_infos = {
                id: conteur,
                name: inputs[0].value,
                role: inputs[1].value,
                img: inputs[2].value,
                email: inputs[3].value,
                phone: inputs[4].value,
                exp: exps,
                inRoom:false
            }
            workers.push(worker_infos);
            //   exp_list.innerHTML = "";
            affichage_workers_cards();
            affichage_workers_cards_toAssign();
        }
    }
});
const exp_container = document.querySelector(".experiences");
function affichage_workers_cards() {
    workers_bar.innerHTML = "";
    workers.forEach(worker => {
        const worker_card = document.createElement("div");
        worker_card.innerHTML = `
            <div class="employee-card">
                <img src="${worker.img}" class="employee-photo" />
                <div class="employee-info">
                    <h4 class="employee-name">${worker.name}</h4>
                    <p class="employee-role">${worker.role}</p>
                    <button id="btn_edit" class="btn-edit">Edit</button>
                </div>
            </div>
    `
        workers_bar.appendChild(worker_card);
    });
    formulaire.reset();
    exp_container.innerHTML="";
}
const assign_container = document.querySelector(".modal_arrang");
function affichage_workers_cards_toAssign() {
    assign_container.innerHTML = "";
    workers.forEach(worker => {
        const worker_card = document.createElement("div");
        worker_card.innerHTML = `
            <div>
                <div class="employee-card_afficher" data-id= "${worker.id}">
                    <img src="${worker.img}" class="employee-photo" />
                    <div class="employee-info">
                        <h4 class="employee-name">${worker.name}</h4>
                        <p class="employee-role">${worker.role}</p>
                        <button id="btn_edit" class="btn-edit">Edit</button>
                    </div>
                </div>

            </div>
    `
        assign_container.appendChild(worker_card);
    });
}




function add_exp(){
    let exp_conteur=0;
    const exp_titl=document.querySelector(".exp_div");
    const btn_ajouter_exp = document.querySelector(".btn_ajouter_exp");
    btn_ajouter_exp.addEventListener("click", (e)=>{
    exp_titl.classList.remove("cache");
    exp_conteur++;
     const exp = document.createElement("div");
     exp.innerHTML= `
     <div class="exp_container" id="exp_container">
                    <label class="labeles">Campany</label>
                    <input type="text" id="email" class="inputs exp_input" required />

                    <label class="labeles">Role</label>
                    <input type="text" id="phone" class="inputs exp_input" required />
                    <label class="labeles">From</label>
                    <input type="text" id="email" class="inputs exp_input" placeholder="   dd/mm/aa" required />

                    <label class="labeles">To</label>
                    <input type="text" id="phone" class="inputs exp_input" placeholder="   dd/mm/aa" required />
                    <button type="button" id="ajouter-exp" class="btn_assign remove_Exp">remove</button>
                </div>

     `
     exp_container.appendChild(exp)
        const remove_exp = document.querySelectorAll(".remove_Exp");
        remove_exp.forEach(e=>{
        e.addEventListener("click", (e)=>{
        const ex = e.target.parentElement;
        exp_conteur--;
        ex.remove();
    })
    });
    });

    if(exp_conteur==0){
        exp_titl.classList.add("cache");
    }
  
};


function validate_experiences() {
    const exp_cont = document.querySelectorAll(".exp_container");
    let valid = true;

    const periode_regex = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[0-2])[\/\-]\d{2,4}$/;
    const text_regex = /^[A-Za-z0-9À-ÿ ,.'!?-]{2,50}$/;
    let exps = [] ;
    exp_cont.forEach(exp => {
        const inputs = exp.querySelectorAll(".exp_input");
        const company = inputs[0].value.trim();
        const role = inputs[1].value.trim();
        const from = inputs[2].value.trim();
        const to = inputs[3].value.trim();

        if (!text_regex.test(company) || !text_regex.test(role) || !periode_regex.test(from) || !periode_regex.test(to)) {
            valid = false;
            exp.style.border = "1.5px solid red";
        }
        if(valid){
        const exp_infos= {
         company: inputs[0].value.trim(),
         role_exp: inputs[1].value.trim(),
         from: inputs[2].value.trim(),
         to: inputs[3].value.trim()
        }
        exps.push(exp_infos)
        }
    });
    return [valid, exps];
}
function room_select(){
const add_btns = document.querySelectorAll("[data-salle]");
add_btns.forEach(btn=>{
btn.addEventListener("click", (e)=>{
    const salle= e.currentTarget.dataset.salle;
    let sale_div=document.getElementById(salle);
    let max_workers=parseInt(sale_div.dataset.maxWorkers);
    let workerkers_in_the_room= sale_div.querySelectorAll('.employee_card_ajoutee');
        if(max_workers<=workerkers_in_the_room.length){
            alert("the room is full remove a worker to add");
            return;
        }
    modal_assign.classList.remove("cache");
    // let modal_arrang = modal_assign.querySelector('.modal_arrang');
    // modal_arrang.innerHTML="";
  let rome_role = sale_div.dataset.role;
  
  switch(salle){
     case "conferance_arrange":
        add_conferance();
     break;
     case "reception_arrange":
        worker_select(sale_div, rome_role);
     break;
     case "servers_arrange":
        add_servers();
     break;
     case "staf_arrangef":
        add_staff();
     break;
     case "security_arrange":
        add_security();
     break;
     case "vault_arrange":
        add_vault();
     break;
    }
})
});

}
room_select();
const modal_select = document.querySelector(".modal_select_container");

function worker_select(sale_div, salle_role){
    const divs = modal_select.querySelectorAll(".employee-card_afficher");
    let worker_id;
    let current_card;
    divs.forEach(div=>{
        div.addEventListener("click", (e)=>{
            div.style.border="none";
            div.style.border=" 2px solid blue";
            worker_id = div.dataset.id;
            current_card = e.currentTarget;
            add_reception(sale_div, salle_role, worker_id, current_card)
        });
    });
}

const assign_btn =document.querySelector("#btn_close");
function add_reception(sale_div, salle_role, worker_id, current_card) {
    console.log(sale_div, salle_role, worker_id, current_card)
    
    const current_worker = workers.find(worker=> Number(worker.id)===Number(worker_id));
    
const receps = [document.querySelector(".reception_container1"), document.querySelector(".reception_container2")];
let recep_choix=receps[0];
for (let i = 0; i < receps.length; i++) {
  const varia = receps[i].querySelectorAll(".employee_card_ajoutee");

  if (varia.length == 5 && i==0) {
    recep_choix = receps[i+1];
  }
}

// if(recep2_element.length>=5){
//     recep_choix=recep1;
// }
// if(recep1_element.length>=5){
//     recep_choix=recep2;
// }
for(let i=1;i<=2;i++){
   eval(`var recep${i} = document.querySelector(".reception_container${i}")`); 
   eval(`var recep${i}_element = recep${i}.querySelectorAll(".employee_card_ajoutee")`);
   eval(` var varia = recep${i}_element`)
   
   console.log("varia: ====",varia);
   
   if(varia.length>=5 && i == 1){
    recep_choix=`recep${i+1}`;
    alert("this part is f");
}
   if(varia.length>=5 && i == 2){
    recep_choix=`recep${i-1}`;
}


// }

    if (current_worker.role=== salle_role) {
    assign_btn.addEventListener("click", (e)=>{
        console.log(recep_choix)
        recep_choix.innerHTML += `
             <div>
                                <div class="employee_card_ajoutee" data-select="selection">
                                    <img src="${current_worker.img}" class="employee_photo_ajoutee" />
                                    <div class="employee_info_ajoutee">
                                        <h4 class="employee_name_ajoutee">${current_worker.name}</h4>
                                        <p class="employee_role_ajoutee">${current_worker.role}</p>
                                    </div>
                                    <button id="btn_remove" class="btn-remove">&times;</button>
                                </div>
    `
})
   }
}