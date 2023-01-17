const startSelection = () => {
    let characters = []
    let retrievedCharacter = JSON.parse(localStorage.getItem('localCharacter'));
    if (retrievedCharacter != null && retrievedCharacter.info.current_hp <= 0){
        localStorage.clear()
        retrievedCharacter = null
    }
    fetch(`http://${ip}?index=characters`)
        .then(res => res.json())
        .then(res => {
            res.map(e => {
                if (e.class != 'Enemy' && e.current_hp){
                    characters.push(e)
                }
            });
            if (retrievedCharacter != null && retrievedCharacter.info.id && retrievedCharacter.info.id != null){
                let iel = retrievedCharacter.info.class === "Sorcière" ? "la" : "le";
                app.innerHTML = `<div id="menu">
                                    <div class="classicBtn" onclick="getCharacter(${retrievedCharacter.info.id})">Continuer avec ${retrievedCharacter.info.name} ${iel} ${retrievedCharacter.info.class}</div>
                                    <div class="classicBtn" onclick="selectCharacter()">Selectionner un personnage</div>
                                    <div class="classicBtn" onclick="createCharacter()">Créer un personnage</div>
                                 </div>`;
            }
            else if (characters.length > 0){
                app.innerHTML = `<div id="menu">
                                    <div class="classicBtn" onclick="selectCharacter()">Selectionner un personnage</div>
                                    <div class="classicBtn" onclick="createCharacter()">Créer un personnage</div>
                                 </div>`;
            } else {
                app.innerHTML = `<div id="menu">
                                     <div class="classicBtn" onclick="createCharacter()">Créer un personnage</div>
                                 </div>`;
            }
        })
}

const exctractEffect = (properties) => {
    if(properties !== undefined || null){
        let props = JSON.parse(properties)
        let target = props[0];
        let operator = props[1];
        let qty = props[2];
        if (target === "current_hp" && operator === "+"){
            return `Restaure ${qty} PV`
        }
        if (target === "current_hp" && operator === "-"){
            return `Retire ${qty} PV`
        }
        if (target === "max_hp" && operator === "+"){
            return `Ajoute ${qty} PV max tant que l'objet est équipé`
        }
        if (target === "max_hp" && operator === "-"){
            return `Retire ${qty} PV max tant que l'objet est équipé`
        }
        if (target === "str" && operator === "+"){
            return `Ajoute ${qty} points de Force tant que l'objet est équipé`
        }
        if (target === "dex" && operator === "+"){
            return `Ajoute ${qty} points de Dextérité tant que l'objet est équipé`
        }
        if (target === "intel" && operator === "+"){
            return `Ajoute ${qty} points d'Intelligence tant que l'objet est équipé`
        }
    }
}

const equipmentModal = (objectId, objectType) => {
    modal.innerHTML = ""
    modal.classList.remove('hideModal')
    fetch(`http://${ip}?find=equipment&character_id=${selectedCharacter.info.id}`)
        .then(res => res.json())
        .then(res => {
            if(objectType === 'Arme'){
                let effect = exctractEffect(res.weapon_properties)
                modal.innerHTML += `<div class="topModal"><div class="ghostModal"></div><div id="typeModal">Objet équipé</div><div class="closeModal" id="closeModal${res.weapon_id}">x</div></div>
                        <div class="titleModal"><div id="titleModal">${res.weapon_name}</div></div>
                        <div class="descriptionModal">
                            <div><u>Type d'objet</u> : ${res.weapon_type}</div>
                            <div><u>Type de classe</u> : ${res.weapon_class}</div>
                            <div><u>Description</u> : "${res.weapon_description}"</div>
                            <div><u>Effet</u> : ${effect}</div>
                        </div>
                        <div id="zoneBtnModal">
                        </div>`
                let closeModal = document.getElementById(`closeModal${res.weapon_id}`)
                closeModal.addEventListener('click', () => {
                    modal.classList.add('hideModal')
                    modal.innerHTML = ""
                })
                let zoneBtn = document.getElementById("zoneBtnModal")
                zoneBtn.innerHTML = `<div id="removeEquipmentBtn${res.weapon_id}" class="classicBtn">Retirer</div>`
                let removeEquipBtn = document.getElementById(`removeEquipmentBtn${res.weapon_id}`)
                removeEquipBtn.addEventListener('click', () => {
                    removeEquipement(res.weapon_id, "Arme", res.weapon_properties)
                })
            }
            if(objectType === 'Armure'){
                let effect = exctractEffect(res.armor_properties)
                modal.innerHTML += `<div class="topModal"><div class="ghostModal"></div><div id="typeModal">Objet équipé</div><div class="closeModal" id="closeModal${res.armor_id}">x</div></div>
                        <div class="titleModal"><div id="titleModal">${res.armor_name}</div></div>
                        <div class="descriptionModal">
                            <div><u>Type d'objet</u> : ${res.armor_type}</div>
                            <div><u>Type de classe</u> : ${res.armor_class}</div>
                            <div><u>Description</u> : "${res.armor_description}"</div>
                            <div><u>Effet</u> : ${effect}</div>
                        </div>
                        <div id="zoneBtnModal">
                        </div>`
                let closeModal = document.getElementById(`closeModal${res.armor_id}`)
                closeModal.addEventListener('click', () => {
                    modal.classList.add('hideModal')
                    modal.innerHTML = ""
                })
                let zoneBtn = document.getElementById("zoneBtnModal")
                zoneBtn.innerHTML = `<div id="removeEquipmentBtn${res.armor_id}" class="classicBtn">Retirer</div>`
                let removeEquipBtn = document.getElementById(`removeEquipmentBtn${res.armor_id}`)
                removeEquipBtn.addEventListener('click', () => {
                    removeEquipement(res.armor_id, "Armure", res.armor_properties)
                })
            }
    })
}
const inventoryModal = (objectId) => {
    modal.innerHTML = ""
    modal.classList.remove('hideModal')
    fetch(`http://${ip}?find=inventory&character_id=${selectedCharacter.info.id}&object_id=${objectId}`)
        .then(res => res.json())
        .then(res => {
            let effect = exctractEffect(res.object_properties)
            //console.log(res.object_properties)
            modal.innerHTML += `<div class="topModal"><div class="ghostModal"></div><div id="typeModal">Objet de l'inventaire</div><div class="closeModal" id="closeModal${res.object_id}">x</div></div>
                        <div class="titleModal"><div id="titleModal">${res.object_name}</div></div>
                        <div class="descriptionModal">
                            <div><u>Type d'objet</u> : ${res.object_type}</div>
                            <div><u>Type de classe</u> : ${res.object_class}</div>
                            <div><u>Description</u> : "${res.object_description}"</div>
                            <div><u>Effet</u> : ${effect}</div>
                            <div><u>Quantité en stock</u> : ${res.quantity}</div>
                        </div>
                        <div id="zoneBtnModal">
                        </div>`
            let closeModal = document.getElementById(`closeModal${res.object_id}`)
            closeModal.addEventListener('click', () => {
                modal.classList.add('hideModal')
                modal.innerHTML = ""
            })
            let zoneBtn = document.getElementById("zoneBtnModal")
            if(res.object_type === "Consommable"){
                zoneBtn.innerHTML = `<div class="classicBtn" onclick="dropObject(${res.object_id}, ${res.quantity})">Jeter</div>
                                     <div class="classicBtn" id="useObject" >Utiliser</div>`
                let useObjectBtn = document.getElementById("useObject")
                useObjectBtn.addEventListener('click', () => {
                    useObject(res.object_id, res.object_properties, res.quantity)
                })
            }
            if(res.object_type === "Arme" || res.object_type === "Armure"){
                zoneBtn.innerHTML = `<div class="classicBtn" onclick="dropObject(${res.object_id}, ${res.quantity})")>Jeter</div>
                                     <div id="equipObject" class="classicBtn" >équiper</div>`
                let equipObjectBtn = document.getElementById("equipObject")
                equipObjectBtn.addEventListener('click', () => {
                    addEquipment(res.object_id, res.object_type, res.object_properties, res.quantity, res.object_class)
                })
            }
        })
}

const equipObject = (object_id, props, qty, object_type) => {
    console.log('type: '+object_type)
    dropObject(object_id, qty)
    let propsArray = JSON.parse(props)
    let target = propsArray[0];
    let operator = propsArray[1];
    let number = propsArray[2];
    let newStat
    let newCurrentHp
    if (operator === "+" && target === "max_hp"){
        newStat = selectedCharacter.info.max_hp + number
        newCurrentHp = selectedCharacter.info.current_hp + number
    }
    if (operator === "+" && target === "str"){
        newStat = selectedCharacter.info.str + number
    }
    if (operator === "+" && target === "dex"){
        newStat = selectedCharacter.info.dex + number
    }
    if (operator === "+" && target === "intel"){
        newStat = selectedCharacter.info.intel + number
    }
    fetch(`http://${ip}?update=character&id=${selectedCharacter.info.id}&col=${target}&value=${newStat}`)
        .then(res => res.json())
        .then(res => {
            if (target === "max_hp" && operator === "+"){
                updateLife("more", number)
            }
            displayHud(selectedCharacter.info.id)
        })

}

const removeEquipement = (object_id, type, props) => {
    console.log(props)
    fetch(`http://${ip}?delete=equipment&character_id=${selectedCharacter.info.id}&object_type=${type}`)
        .then(res => res.json())
        .then(res => {
            updateInventory(selectedCharacter.info.id, object_id, "more", 1)
            if (props !== []) {
                let propsEquipment = JSON.parse(props)
                let target = propsEquipment[0];
                let operator = propsEquipment[1];
                let number = propsEquipment[2];
                let newStat
                let newCurrentHp
                if (operator === "+" && target === "max_hp") {
                    newStat = selectedCharacter.info.max_hp - number
                    newCurrentHp = selectedCharacter.info.current_hp - number
                }
                if (operator === "+" && target === "str") {
                    newStat = selectedCharacter.info.str - number
                }
                if (operator === "+" && target === "dex") {
                    newStat = selectedCharacter.info.dex - number
                }
                if (operator === "+" && target === "intel") {
                    newStat = selectedCharacter.info.intel - number
                }
                fetch(`http://${ip}?update=character&id=${selectedCharacter.info.id}&col=${target}&value=${newStat}`)
                    .then(res => res.json())
                    .then(res => {
                        if (target === "max_hp" && operator === "+") {
                            if ((selectedCharacter.info.currentHp - number) <= 0){
                                fetch(`http://${ip}?upadte=character&id=${selectedCharacter.info.id}&col=current_hp&value=1`)
                                    .then(res => res.json())
                                    .then(res => {

                                    })
                            } else {
                                updateLife("less", number)
                            }
                        }
                        displayHud(selectedCharacter.info.id)
                        modal.innerHTML = ""
                        modal.classList.add("hideModal")
                    })
            } else {
                displayHud(selectedCharacter.info.id)
                modal.innerHTML = ""
                modal.classList.add("hideModal")
            }
        })
}
const addEquipment = (object_id, object_type, props, qty, objectClassType) => {
    let type
    let equipedItem
    let equipedProps
    if (object_type === 'Arme'){
        type = "weapon_id"
        equipedItem = selectedCharacter.equipment['weapon_id']
        equipedProps = selectedCharacter.equipment['weapon_properties']
    }
    if (object_type === "Armure"){
        type = "armor_id"
        equipedItem = selectedCharacter.equipment['armor_id']
        equipedProps = selectedCharacter.equipment['armor_properties']
    }
    //console.log(equipedItem)
    //console.log(object_id)
    // if (selectedCharacter.equipment.armor_id != null || selectedCharacter.equipment.weapon_id != null){
    //         removeEquipement(object_id,object_type, props)
    // }
    if(selectedCharacter.equipment['armor_id'] == null || selectedCharacter.equipment['weapon_id'] == null){
        fetch(`http://${ip}?find=class&col=name&value=${selectedCharacter.info.class}`)
            .then(res => res.json())
            .then(res => {
                let characterClassType = res.type
                console.log(characterClassType)
                if((objectClassType === characterClassType || objectClassType === "Toutes") && equipedItem !== object_id && selectedCharacter.equipment[type] === null){
                    fetch(`http://${ip}?update=equipment&${type}=${object_id}&character_id=${selectedCharacter.info.id}`)
                        .then(res => res.json())
                        .then(res=> {
                            equipObject(object_id, props, qty, object_type)
                            displayHud(selectedCharacter.info.id)
                        })
                    // } else if () {
                    //     if(equipedItem === object_id){
                    //         removeEquipement(object_id, object_type,equipedProps)
                    //         //addEquipment(object_id, object_type, props, qty, objectClassType)
                    //     }
                } else {
                    modal.classList.add("shakeInput")
                    setTimeout(() => {
                        modal.classList.remove("shakeInput")
                    }, 1000)
                }
            })
    } else {
        modal.classList.add("shakeInput")
        setTimeout(() => {
            modal.classList.remove("shakeInput")
        }, 1000)
    }
}

const useObject = (object_id, props, qty) => {
    let newQty = qty - 1
    let propsArray = JSON.parse(props)
    let target = propsArray[0];
    let operator = propsArray[1];
    let number = propsArray[2];
    if(target === "current_hp" && operator === "+"){
        if (selectedCharacter.info.current_hp !== selectedCharacter.info.max_hp){
            updateLife("more", number)
            updateInventory(selectedCharacter.info.id, object_id, "less", 1)
            displayHud(selectedCharacter.info.id)
            inventoryModal(object_id)
            if(newQty === 0){
                modal.innerHTML = ""
                modal.classList.add('hideModal')
            }
        } else {
            modal.classList.add("shakeInput")
            setTimeout(() => {
                modal.classList.remove("shakeInput")
            }, 500)
        }

    }
    if(target === "current_hp" && operator === "-"){
        updateLife("less", number)
        updateInventory(selectedCharacter.info.id, object_id, "less", 1)
        displayHud(selectedCharacter.info.id)
        inventoryModal(object_id)
        if(newQty === 0){
            modal.innerHTML = ""
            modal.classList.add('hideModal')
        }
    }
}
const dropObject = (object_id, qty) => {
    let newQty = qty - 1
    fetch(`http://${ip}?update=inventory&character_id=${selectedCharacter.info.id}&object_id=${object_id}&operator=less&qty=1`)
        .then(res => res.json())
        .then(res => {
            displayHud(selectedCharacter.info.id)
            console.log(res)
            inventoryModal(object_id)
            if(newQty === 0){
                modal.innerHTML = ""
                modal.classList.add('hideModal')
            }
        })
}
const createAndGetCharacter = async (heroName, heroClass) => {
    const characterCreation = await fetch(`http://${ip}?create=character&name=${heroName}&class=${heroClass}`)
    selectedCharacter = await characterCreation.json()
    startGame();
}

const getCharacter = async (characterId) => {
    const characterCreation = await fetch(`http://${ip}?find=character&id=${characterId}`)
    selectedCharacter = await characterCreation.json()
    localStorage.setItem('localCharacter', JSON.stringify(selectedCharacter))
    startGame();
}
const updateInventory = (characterId, objectId, operator, qty) =>
{
    fetch(`http://${ip}?update=inventory&character_id=${characterId}&object_id=${objectId}&operator=${operator}&qty=${qty}`)
        .then(res => res.json())
        .then(res => {
            displayHud(characterId)
            console.log(res)
        })
}

const updateLife = (operator, hp) =>
{
    fetch(`http://${ip}?update=life&character_id=${selectedCharacter.info.id}&operator=${operator}&hp=${hp}`)
        .then(res => res.json())
        .then(res => {
            displayHud(selectedCharacter.info.id)
            //console.log(res)
        })
}

const updateFightScore = () => {
    let newScore = selectedCharacter.info.fight_count + 1
    fetch(`http://${ip}?update=character&id=${selectedCharacter.info.id}&col=fight_count&value=${newScore}`)
        .then(res => res.json())
        .then(res => {
            displayHud(selectedCharacter.info.id)
        })
}

const createCharacter = () => {
    app.innerHTML = ""
    fetch(`http://${ip}?index=classes`)
        .then(res => res.json())
        .then(res => {
            let classes = res
            app.innerHTML = `<div id="creationMenu">
                                <div class="nameInput">
                                    <input type="text" id="nameCreation" placeholder="Nom du personnage">
                                    <div id="selectClass">`
                +
                classes.map(e => {
                    return `<div tabindex="-1" class="classicSelectBtnClass" id="selectedClass${e.id}" onclick="infoClass(${e.id})">${e.name}</div>`
                }).join("")
                +
                `</div>
                                </div>
                                <div id="creationInfo">                                  
                                </div>
                                <div id="creationBtn"></div>
                            </div>`

        })
}

function selectCharacter(){
    fetch(`http://${ip}?index=characters`)
        .then(res => res.json())
        .then(res => {
            let characters = [];
            res.map(e => {
                if (e.class != 'Enemy' && e.current_hp > 0){
                    characters.push(e)
                }
            });
            app.innerHTML = ""
            app.innerHTML = `<div id="selectCharacterTable">
                                <table id="selectionTable">
                                    
                                </table>
                             </div>`
            let selectionTable = document.getElementById("selectionTable")
            characters.map(e => {
                selectionTable.innerHTML += `<tr id="selectedRow${e.id}" tabindex="-1"  class="selectionRow" onclick="selectCharacterTable(${e.id})">
                                                <td class="colTable" id="selectedCol${e.id}"><b>${e.name}</b> | ${e.class}</td>
                                            </tr>`
            })
            let selectCharacterTable = document.getElementById("selectCharacterTable")
            selectCharacterTable.innerHTML += `<div id="btnSelectCharacter"></div>`
        })
}

function infoClass (selectedClassId) {
    let allClassBtn = document.querySelectorAll('.classicSelectBtnClass')
    allClassBtn.forEach(e => e.classList.remove('classicSelectBtnFocus'))
    let creationInfo = document.getElementById('creationInfo')
    let creationBtn = document.getElementById('creationBtn')
    let selectedClass = document.getElementById(`selectedClass${selectedClassId}`)
    selectedClass.classList.add('classicSelectBtnFocus')
    fetch(`http://${ip}?find=class&col=id&value=${selectedClassId}`)
        .then(res => res.json())
        .then(res => {
            creationInfo.innerHTML = `<div class="block blockText">
                            <h3><u>Biographie de votre personnage:</u></h3>
                            <p>${res.excerpt}</p>
                        </div>
                        <div class="block blockStats">
                            <div>
                            <h3><u>Statistiques de classe:</u></h3>
                            <p><b>Type de classe:</b> ${res.type}</p>
                            <p><b>PV:</b> ${res.hp}</p>
                            <p><b>Force:</b> ${res.str}</p>
                            <p><b>Dextérité:</b> ${res.dex}</p>
                            <p><b>Intelligence:</b> ${res.intel}</p>
                            </div>
                        </div>`
            creationBtn.innerHTML = `<div class='classicBtn' id="characterCreationBtn">valider la création</div>`
            let createBtn = document.getElementById('characterCreationBtn')

            createBtn.addEventListener('click', () => {
                let nameInput = document.getElementById('nameCreation')
                let selectedClassName = res.name
                if (nameInput.value === ""){
                    nameInput.classList.add("shakeInput")
                    setTimeout(() => {
                        nameInput.classList.remove("shakeInput")
                    }, 500)
                } else {
                    createAndGetCharacter(nameInput.value, selectedClassName).then(r => r)
                }
            })
        })
}