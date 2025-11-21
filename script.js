let workers = [];
let assigned_workers=[];
const body = document.querySelector(".body")
const modal_assign = document.getElementById("modal_assign");
const form_modal = document.getElementById("form_modal");


const elements = document.querySelectorAll(".elements");

elements.forEach(element=> {
    element.addEventListener("click", modal_Open);
});

function modal_Open(event) {
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
            const worker_id = event.target.closest("[data-id]").dataset.id;
            console.log(worker_id);
            
            const worker = assigned_workers.find(worker => worker.id === Number(worker_id));
            const room_actuelle = event.target.closest("[data-id]").parentElement.parentElement.parentElement.dataset.room;
            console.log(room_actuelle)
            const modal = document.createElement("div");
            modal.innerHTML = `
        <div class="modal" id="modal_info">
        <div class="modal_info_container" id="modal_info_container">
                <span id="close_modal" class="close_modal elements" data-select="close">&times;</span>
                <div class="employee-card_infos">
                    <img src = "${worker.img}" class="employee-photo_infos" />
                    <div class="employee-info_infos">
                        <h2>${worker.name}</h2>
                        <p class="employee-role_infos">${worker.role}</p>
                        <button id="btn_edit" class="btn-edit">Edit</button>
                    </div>
                </div> 
                <div class="employee-card_infos email_location">
                    <div class="employee-info_infos email_location1">
                        <h3>Email: <span class="employee-role_info">${worker.email}</span></h3>
                        <h3>Phone: <span class="employee-role_info">${worker.phone}</span></h3>
                        <h3>Current location: <span class="employee-role_info">${room_actuelle}</span></h3>

                        <!-- <button id="btn_edit" class="btn-edit">Edit</button> -->
                    </div>
                </div>
                <h3>Work experiences</h3>
                <div class="exp_infos">
                </div>

        </div>
    </div>

 `;
body.appendChild(modal);
modal.querySelector(".elements").addEventListener("click", modal_Open);
const exp_infos = body.querySelector(".exp_infos");
            worker.exp.forEach(exp => {
                const div = document.createElement("div");
                div.innerHTML = `
                    <div class="employee-card_infos email_location exp">
                    <div class="employee-info_infos email_location1">
                        <h3>${exp.company}</h3>
                        <h3>Role: <span class="employee-role_info">${exp.role_exp}</span></h3>
                        <h3>Periode: <span class="employee-role_info">11/12/2024 - 13/10/2025</span></h3>
                        <!-- <button id="btn_edit" class="btn-edit">Edit</button> -->
                    </div>
    `
                exp_infos.appendChild(div);
            });

            break;
        case "close":
            const model = document.querySelector("#modal_info");
            if (model !== null) {
                model.querySelector("[data-select='close']")
                    model.remove();
            }
            modal_assign.classList.add("cache");
            form_modal.classList.add("cache");
            break;



        case "remove":
        const btn = event.target.closest("[data-select='remove']");
              const element_sup_id = btn.parentElement.dataset.id;

              
            const worker_sup = assigned_workers.find(assigned_worker=>assigned_worker.id === Number(element_sup_id));
            const element_sup_index = assigned_workers.findIndex(assigned_worker=>assigned_worker.id===Number(element_sup_id));
            
             workers.push(worker_sup);
             assigned_workers.splice(element_sup_index, 1);
             btn.parentElement.remove();
             affichage_workers_cards();
             affichage_workers_cards_toAssign();
        break;
    }
}
const workers_bar = document.querySelector(".staff_list")
const inputs = document.querySelectorAll(".inputs");
const photo_previw = document.querySelector("#show");
inputs[2].addEventListener("change", (e)=>{
photo_previw.setAttribute("src", inputs[2].value);
});
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
        if (!img_regex.test(inputs[2].value) || !name_regex.test(inputs[0].value) ||
            !role_regex.test(inputs[1].value) || !email_regex.test(inputs[3].value) ||
            !phone_regex.test(inputs[4].value)) {
            valide = false;
        }

        if (!valide) {
            return;
        }
        const [valid_exp, exps] = validate_experiences();
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
                inRoom: false
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
    photo_previw.removeAttribute("src");
    exp_container.innerHTML = "";
}
const assign_container = document.querySelector(".modal_arrang");

function affichage_workers_cards_toAssign() {
    assign_container.innerHTML = "";
    workers.forEach(worker => {
        const worker_card = document.createElement("div");
        worker_card.innerHTML = `
            <div>
                <div class="employee-card_afficher elements" data-id= "${worker.id}">
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




function add_exp() {
    let exp_conteur = 0;
    const btn_ajouter_exp = document.querySelector(".btn_ajouter_exp");
    btn_ajouter_exp.addEventListener("click", (e) => {
        exp_conteur++;
        const exp = document.createElement("div");
        exp.innerHTML = `
     <div class="exp_container" id="exp_container">
                <div id="exp_div" class="exp_div labeles">
                    <h3>Expérience:</h3>
                </div>


                    <label class="labeles">Campany</label>
                    <input type="text" id="email" class="inputs exp_input" required />

                    <label class="labeles">Role</label>
                    <input type="text" id="phone" class="inputs exp_input" required />
                    <label class="labeles">From</label>
                    <input type="date" id="email" class="inputs exp_input" required />

                    <label class="labeles">To</label>
                    <input type="date" id="phone" class="inputs exp_input" required />
                    <button type="button" id="ajouter-exp" class="btn_assign remove_Exp">remove</button>
                </div>

     `
        exp_container.appendChild(exp)
        const remove_exp = document.querySelectorAll(".remove_Exp");
        remove_exp.forEach(e => {
            e.addEventListener("click", (e) => {
                const ex = e.target.parentElement;
                exp_conteur--;
                ex.remove();
            })
        });
    });

}


function validate_experiences() {
    const exp_cont = document.querySelectorAll(".exp_container");
    let valid = true;

    const periode_regex = /^\d{4}-\d{2}-\d{2}$/;
    const text_regex = /^[A-Za-z0-9À-ÿ ,.'!?-]{2,50}$/;
    let exps = [];
    exp_cont.forEach(exp => {
        const inputs = exp.querySelectorAll(".exp_input");
        const company = inputs[0].value.trim();
        const role = inputs[1].value.trim();
        const from = inputs[2].value.trim();
        const to = inputs[3].value.trim();

        const date_comp = comparedates(inputs[2].value, inputs[3].value);
        
        if(!date_comp){
            valid = false;
        }
        if (!text_regex.test(company) || !text_regex.test(role) || !periode_regex.test(from) || !periode_regex.test(to)) {
            valid = false;
            exp.style.border = "1px solid red";
        }
        if (valid) {
            const exp_infos = {
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
function comparedates(from, to){
    console.log(from, to)
let date1 = new Date(from).getTime();
let date2 = new Date(to).getTime();
console.log(date2, date1);

if(date2<=date1){
    return false;
    alert("the date of start canoot be bigger than the one of end the exp")
}
else{
    return true;
}
}











const add_btns = document.querySelectorAll("[data-salle]");
add_btns.forEach(btn => {
    btn.addEventListener("click", (e) => {
        room_select()
        function room_select() {
            const salle = e.currentTarget.dataset.salle;
            let sale_div = document.getElementById(salle);
            let max_workers = parseInt(sale_div.dataset.maxWorkers);
            modal_assign.classList.remove("cache");
            let rome_role = sale_div.dataset.role;
            switch (salle) {
                case "conferance_arrange":
                    worker_select(sale_div, rome_role, max_workers, 1);
                    break;
                case "reception_arrange":
                    worker_select(sale_div, rome_role, max_workers, 2);
                    break;
                case "servers_arrange":
                    worker_select(sale_div, rome_role, max_workers, 3);
                    break;
                case "staff_arrange":
                    worker_select(sale_div, rome_role, max_workers, 4);
                    break;
                case "security_arrange":
                    worker_select(sale_div, rome_role, max_workers, 5);
                    break;
                case "archives_arrange":
                    worker_select(sale_div, rome_role, max_workers, 6);
                    break;
            }
        }
    })
});

const modal_select = document.querySelector(".modal_select_container");
let current_worker = 0;


function worker_select(sale_div, salle_role, max_workers, index) {
    const divs = modal_select.querySelectorAll(".employee-card_afficher");
    let worker_id;
    let current_card;
    divs.forEach(div => {
          div.style.border = "none";
        div.addEventListener("click", (e) => {
            div.style.border = " 2px solid blue";
            worker_id = div.dataset.id;
            current_worker = workers.find(worker => Number(worker.id) === Number(worker_id));
            current_index = workers.findIndex(worker => Number(worker.id) === Number(worker_id))
            current_card = e.currentTarget;
            add_selon_role(sale_div, salle_role, current_worker, current_card, max_workers, index, current_index);
        });
    });
}

const assign_btn = document.querySelector("#btn_close");

function add_selon_role(sale_div, salle_role, current_worker, current_card, max_workers, index, current_index) {
    let salle_specifique_roles = salle_role;
    assign_btn.onclick = (e) => {
        let recep_choix = null;
        let div_a_Afficher = null;
        let receps = [];
        const max_sale = sale_div.querySelectorAll(".employee_card_ajoutee").length;
        if (max_sale >= max_workers) {
            alert("this salle is full");
            return;
        }
        switch (index) {
            case 1:
                receps = [document.querySelector(".conferance_container1"), document.querySelector(".conferance_container2")];
                div_a_Afficher = receps[0].querySelectorAll(".employee_card_ajoutee").length;
                recep_choix = (div_a_Afficher < 3) ? receps[0] : receps[1];
                salle_specifique_roles = ["Manager", "Nettoyage", salle_role]
                break;
            case 2:
                receps = [document.querySelector(".reception_container1"), document.querySelector(".reception_container2")];
                div_a_Afficher = receps[0].querySelectorAll(".employee_card_ajoutee").length;
                recep_choix = (div_a_Afficher < 5) ? receps[0] : receps[1];
                salle_specifique_roles = ["Manager", "Nettoyage", salle_role]
                break;
            case 3:
                receps = [document.querySelector("#servers_container1")];
                div_a_Afficher = receps[0].querySelectorAll(".employee_card_ajoutee").length;
                recep_choix = receps[0];
                salle_specifique_roles = ["Manager", "Nettoyage", salle_role]
                break;
            case 4:
                receps = [document.querySelector("#staff_container1")];
                div_a_Afficher = receps[0].querySelectorAll(".employee_card_ajoutee").length;
                recep_choix = receps[0];
                salle_specifique_roles = ["Manager", "Nettoyage", salle_role]
                break;
            case 5:
                receps = [document.querySelector("#security_container1")];
                div_a_Afficher = receps[0].querySelectorAll(".employee_card_ajoutee").length;
                recep_choix = receps[0];
                salle_specifique_roles = ["Manager", "Nettoyage", salle_role]
                break;
            case 6:
                receps = [document.querySelector("#archives_container1")];
                div_a_Afficher = receps[0].querySelectorAll(".employee_card_ajoutee").length;
                recep_choix = receps[0];
                salle_specifique_roles = ["Manager", salle_role]
                break;
        }
        for (role of salle_specifique_roles) {
            if (current_worker.role === role) {
                recep_choix.innerHTML += `
             <div>
                                <div class="employee_card_ajoutee" data-select="selection" data-id="${current_worker.id}">
                                    <img src="${current_worker.img}" class="employee_photo_ajoutee" />
                                    <div class="employee_info_ajoutee">
                                        <h4 class="employee_name_ajoutee">${current_worker.name}</h4>
                                        <p class="employee_role_ajoutee">${current_worker.role}</p>
                                    </div>
                                    <button id="btn_remove" class="btn-remove" data-select="remove">&times;</button>
                                </div>
    `
    recep_choix.querySelector(`[data-id="${current_worker.id}"]`).addEventListener("click", modal_Open);
            assigned_workers.push(current_worker);
            workers.splice(current_index,1)
             current_card.remove();
             affichage_workers_cards();
                return;
            }
            else {
                if (role === salle_role) {
                    alert("cet employee ne peut pas etre ici");
                }

            }

        }
    }

}