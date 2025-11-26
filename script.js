// les tableaux pour les employee
let workers = [];
let assigned_workers = [];
const body = document.querySelector(".body")
const modal_assign = document.getElementById("modal_assign");
const form_modal = document.getElementById("form_modal");

// les elements sont tous wui ont data-select
const elements = document.querySelectorAll(".elements");
elements.forEach(element => {
    element.addEventListener("click", modal_open);
});


//la fonction qui affiche les modal selon la data-select
function modal_open(event) {

//la determination de type de data-select
    const select = event.target.closest("[data-select]");
    const data_select = select.dataset.select;
// les cases de data-select
    switch (data_select) {
        case "add":
// affichage du model de la formulaire.
            form_modal.classList.remove("cache");
            break;
// affichge des infos de l'employee
        case "selection":
// la determination de l'employee responsable a cet zone dans le tableau des employee assignees
            const worker_id = event.target.closest("[data-id]").dataset.id;
            const worker = assigned_workers.find(worker => worker.id === Number(worker_id));
// le room_actuelle pour l'afficher dans le model des infos
            // const room_actuelle = event.target.closest("[data-id]").parentElement.parentElement.parentElement.dataset.room;
            const room_actuelle = event.target.closest("[data-room]").dataset.room;
            console.log(room_actuelle);
// l'ajout du model
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
                </div>
            </div>
            <h3>Work experiences</h3>
            <div class="exp_infos">
            </div>

        </div>
    </div>
`;
            body.appendChild(modal);
            modal.querySelector(".elements").addEventListener("click", modal_open);
// affichge des experiences
            const exp_infos = body.querySelector(".exp_infos");
            worker.exp.forEach(exp => {
                const div = document.createElement("div");
                div.innerHTML = `
                <div class="employee-card_infos email_location exp">
                    <div class="employee-info_infos email_location1">
                        <h3>${exp.company}</h3>
                        <h3>Role: <span class="employee-role_info">${exp.role_exp}</span></h3>
                        <h3>Periode: <span class="employee-role_info">${exp.from} - ${exp.to}</span></h3>
                    </div>
                </div>
        `
                exp_infos.appendChild(div);
            });
            break;
// closing tout les modal oar cet data-select
        case "close":
            const model = document.querySelector("#modal_info");
            if (model !== null) {
                model.querySelector("#close_modal")
                model.remove();
            }
            modal_assign.classList.add("cache");
            form_modal.classList.add("cache");
        break;
// remove des employee assignee
        case "remove":
            const btn = event.target.closest("[data-select='remove']");
            const element_sup_id = btn.parentElement.dataset.id;
// determine l'inedex et l'id correspandant a la btn 
            const worker_sup = assigned_workers.find(assigned_worker => assigned_worker.id === Number(element_sup_id));
            const element_sup_index = assigned_workers.findIndex(assigned_worker => assigned_worker.id === Number(element_sup_id));

            workers.push(worker_sup);
            assigned_workers.splice(element_sup_index, 1);
            btn.parentElement.remove();

// la recall de la fonction pour afficher les elements sans l'element suprimee
            affichage_workers_cards();
            affichage_workers_cards_toAssign();
            salles_vides();
            break;
    }
}
// image preview 
const workers_bar = document.querySelector(".staff_list")

const inputs = document.querySelectorAll(".inputs");

const photo_previw = document.querySelector("#show");

inputs[2].addEventListener("change", (e) => {
    photo_previw.setAttribute("src", inputs[2].value);
});

const formulaire = document.getElementById("worker_formulaire");

//conteur pour incrimente l'id
let conteur = 0;

add_exp();

// la fonction validation de la formulaire

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
//make sure l'input est plein
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
            alert("input s not valide.");
            return;
        }
// selection des element que j'ai envoyer avec la fonction qui valide les exp
// ca return false to valid_exp
        const [valid_exp, exps] = validate_experiences();
        if (!valid_exp) {
            alert("input of experiences s not valide.");
            return;
        }
// find manager pour arrter si on a pas assignee le manager car il y'a un seul manager
        const manager = workers.some(manager => manager.manager === true)
// find manager pour arrter si on a assignee le manager car il y'a un seul manager
        let manager_assigned = null;
        if (assigned_workers.length >= 1) {
            manager_assigned = assigned_workers.find(worker => worker.manager === true)
        }
// cheack if there is a manager
        if (manager || (inputs[1].value === "Manager" && manager_assigned)) {
            alert("there is only one manager")
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
                manager: false
            }
            if (worker_infos.role === "Manager") {
                worker_infos.manager = true;
            }
            else {
                worker_infos.manager = false;
            }
            workers.push(worker_infos);
            //   exp_list.innerHTML = "";
            affichage_workers_cards();
            affichage_workers_cards_toAssign();
        }
    }
});

//selection de exp container in order to empty it
const exp_container = document.querySelector(".experiences");

// la fonction ui affiche les employee dans sidebar
function affichage_workers_cards() {
    workers_bar.innerHTML = "";
    workers.forEach(worker => {
        const worker_card = document.createElement("div");
        worker_card.innerHTML = `
            <div class="employee-card" data-id= "${worker.id}" data-select="selection">
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

//selection de assign model container in order to empty it
const assign_container = document.querySelector(".modal_arrang");

//la fonction qui affiche les elements a selectionne dans le modal to assign
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

// la fonction qui ajout les exp avec la validation
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
        exp_container.appendChild(exp);
        const remove_exp = document.querySelectorAll(".remove_Exp");
        remove_exp.forEach(e => {
            e.addEventListener("click", (e) => {
                const ex = e.target.parentElement;
                exp_conteur--;
                ex.remove();
            });
        });
    });

}
// la fonction de la validation de formulaire
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
// envoie de les dates afin de les comparer
        const date_comp = comparedates(inputs[2].value, inputs[3].value);
        if (!date_comp) {
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
// la fonction qui compare la date
function comparedates(from, to) {
    let date1 = new Date(from).getTime();
    let date2 = new Date(to).getTime();
    if (date2 <= date1) {
        return false;
        alert("the date of start canoot be more than the one of end the exp")
    }
    else {
        return true;
    }
}

//la fonction qui determine la salle choisit
const add_btns = document.querySelectorAll("[data-salle]");
add_btns.forEach(btn => {
    btn.addEventListener("click", (e) => {
        room_select()
        function room_select() {
            const salle = e.currentTarget.dataset.salle;
            let sale_div = document.getElementById(salle);
            let max_workers = parseInt(sale_div.dataset.maxWorkers);
// affichage de la modal pour assigner un employee
            modal_assign.classList.remove("cache");
// la determination de la role du salle
            let rome_role = sale_div.dataset.role;
//switch selon la salle id
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

// la fonction qui select worker afin de l'assigner
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
// la fonction qui l'ajout dans la salle choisit
function add_selon_role(sale_div, salle_role, current_worker, current_card, max_workers, index, current_index) {
    let salle_specifique_roles = salle_role;
    assign_btn.onclick = (e) => {
        let recep_choix;
        let div_a_Afficher;
        let receps = [];
// le nbr des employees dans la salle 
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
                salle_specifique_roles = ["Manager", "Nettoyage", "Employé", salle_role]
                break;
            case 5:
                receps = [document.querySelector("#security_container1")];
                div_a_Afficher = receps[0].querySelectorAll(".employee_card_ajoutee").length;
                recep_choix = receps[0];
                salle_specifique_roles = ["Manager", "Nettoyage", "Employé", salle_role]
                break;
            case 6:
                receps = [document.querySelector("#archives_container1")];
                div_a_Afficher = receps[0].querySelectorAll(".employee_card_ajoutee").length;
                recep_choix = receps[0];
                salle_specifique_roles = ["Manager", "Employé", salle_role]
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
                recep_choix.querySelector(`[data-id="${current_worker.id}"]`).addEventListener("click", modal_open);
                assigned_workers.push(current_worker);
                workers.splice(current_index, 1)
                current_card.remove();
                salles_vides()
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

// la fonction qui mettre les salles rouge pale si elle est vide
function salles_vides() {
    const rooms = document.querySelectorAll(".salle");
    rooms.forEach(room => {
        room.parentElement.style.backgroundColor = "transparent"
        const nbr_workers = room.querySelectorAll(".employee_card_ajoutee").length;
        if (nbr_workers == 0) {
            room.parentElement.style.backgroundColor = "rgba(255, 0, 0, 0.25)";
        }
    })
}
salles_vides();










