const app = document.getElementById("app");
const hud = document.getElementById("hud")
let appBorder = document.getElementById('appBorder')
const connexion = document.getElementById('connexion')
const modal = document.getElementById("modal")

let selectedCharacter;

let enemyState

let listOfEvents;


const selectCharacterTable = (characterId) => {
    let allSelectRow = document.querySelectorAll('.selectionRow')
    allSelectRow.forEach(e => e.classList.remove('selectRowCharacter'))
    let allSelectCol = document.querySelectorAll('.colTable')
    allSelectCol.forEach(e => e.classList.remove('selectColCharacter'))
    let selectedRow = document.getElementById("selectedRow"+characterId)
    let selectedCol = document.getElementById("selectedCol"+characterId)
    selectedRow.classList.add('selectRowCharacter')
    selectedCol.classList.add('selectColCharacter')
    let btnCharacterTable = document.getElementById("btnSelectCharacter")
    btnCharacterTable.innerHTML = `<div class="classicBtn" id="removeSelection">supprimer</div>`
    btnCharacterTable.innerHTML += `<div class="classicBtn" id="validateSelection">selectionner</div>`
    let removeSelection = document.getElementById("removeSelection")
    removeSelection.addEventListener('click', () => {
        removeCharacter(characterId).then(r => r)
    })
    let validateSelection = document.getElementById("validateSelection")
    validateSelection.addEventListener('click', () => {
        getCharacter(characterId).then(r => r)
    })
}


const removeCharacter = async (characterId) => {
    const characterDelete = await fetch(`http://${ip}?delete=character&id=${characterId}`)
    selectedCharacter = await characterDelete.json()
    selectCharacter();
}



const startGame = () => {
    displayHud(selectedCharacter.info.id)
    let lela
    selectedCharacter.info.class === "Sorcière" ? lela = "la" : lela = "le"
    connexion.innerHTML = `${selectedCharacter.info.name} ${lela} ${selectedCharacter.info.class}`
    app.innerHTML = "";
    app.innerHTML = `<div id="chooseEvent">
                    </div>`
    let chooseEvent = document.getElementById("chooseEvent")
    fetch(`http://${ip}?create=event&qty=random`)
        .then(res => res.json())
        .then(res => {
            let arr = 0
            res.map(event => {
                arr++
                chooseEvent.innerHTML += `<div class="squareZone"><div onclick="startEvent('${event.typeOfEvent}')" class="square" id="square${arr}"></div><h4 class="squareTitle">${event.typeOfEvent}</h4></div>`
            })
            //app.innerHTML += ` <div class="classicBtn" onclick="startGame()">Relancer</div>`
        })
}

const displayEventDialog = (title, dialog, eventBtn) => {
        app.innerHTML = `<div id="eventDialog">
                        <div id="eventTitle">évènement en cours : ${title}</div>
                        <div class="screen" id="screen"></div>
                        <div id="dialog">${dialog}</div>
                        <div id="btnNextPlace">
                            <div class="classicBtn" id="eventBtn">${eventBtn}</div>
                        </div>
                    </div>`
}

const displayFightDialog = (title, dialog, eventBtnText, eventBtnId, screenId, btnNextPlaceId) => {
    if (eventBtnText === ""){
        app.innerHTML = `<div id="eventDialog">
                        <div id="eventTitle">évènement en cours : ${title}</div>
                        <div id="${screenId}" class="screen"></div>
                        <div id="dialog">${dialog}</div>
                        <div class="btnNextPlace" id="${btnNextPlaceId}">
                            
                        </div>
                    </div>`
    } else {
        app.innerHTML = `<div id="eventDialog">
                        <div id="eventTitle">évènement en cours : ${title}</div>
                        <div id="${screenId}" class="screen"></div>
                        <div id="dialog">${dialog}</div>
                        <div class="btnNextPlace" id="${btnNextPlaceId}">
                            <div class="classicBtn" id="${eventBtnId}">${eventBtnText}</div>
                        </div>
                    </div>`
    }
}

const startChest = (chestEvent) => {
    displayEventDialog(chestEvent.typeOfEvent, `Le coffre contenait ${chestEvent.object.name}.`, "Prendre l'objet")
    let screen = document.getElementById('screen')
    let btn = document.getElementById("eventBtn")
    btn.addEventListener('click',() => {
        updateInventory(selectedCharacter.info.id, chestEvent.object.id, "more", 1)
        displayEventDialog(chestEvent.typeOfEvent, `Vous vous emparez de l'objet et le placez dans votre sac.`, "Continuer à explorer le donjon")
        let btnNextSpace = document.getElementById("btnNextPlace")
        btnNextSpace.innerHTML = `<div class="classicBtn" onclick="startGame()">Continuer à explorer le donjon</div>`
    })
}

const startTrap = (trapEvent) => {
    let damage = trapEvent.damage
    let diceObjective = trapEvent.dice
    let dialog = `Pour savoir si la Chance est de votre coté et si vous parviendrez à vous sortir de ce mauvais pas, vous devez obtenir un chiffre supérieur ou égal à ${diceObjective} au lancé de dé du Destin !`;
    displayEventDialog(trapEvent.typeOfEvent, dialog, "lancer le dé")
    let screen = document.getElementById('screen')
    let btn = document.getElementById("eventBtn")
    btn.addEventListener('click',() => {
        let score = 0
        let max = 20
        let interval = dice(screen, max)
        let btnNextSpace = document.getElementById("btnNextPlace")
        btnNextSpace.innerHTML = ""
        setTimeout(() => {
            clearInterval(interval)
            score = Math.round(Math.random() * (max - 1) + 1)
            screen.innerHTML = `<div class="dice diceScore">${score}</div>`
                if (score >= diceObjective){
                    setTimeout(() => {
                    displayEventDialog(trapEvent.typeOfEvent, `Le lancé de dé du Destin vous à accordé un score de ${score}. La Chance semble être de votre coté. Vous êtes parvenu à échapper à ce piège sans une égratignure !`, "Continuer à explorer le donjon")
                    let btnNextSpace = document.getElementById("btnNextPlace")
                    btnNextSpace.innerHTML = `<div class="classicBtn" onclick="startGame()">Continuer à explorer le donjon</div>`
                    }, 1500)
                } else {
                    setTimeout(() => {
                        let hud = document.getElementById("characterHud")
                        hud.classList.add("shakeInput")
                        setTimeout(() => {
                            hud.classList.remove("shakeInput")
                            updateLife("less", damage)
                        }, 1000)
                        displayEventDialog(trapEvent.typeOfEvent, `Le lancé de dé du Destin vous à accordé un score de seulement ${score} au lieu de ${diceObjective} ou plus. Malgré tout vos efforts, et bien que vous soyez parvenu à vous échapper de ce piège, cela ne s'est pas fait sans heurt.<br> Dans votre lutte pour votre survie, vous avez reçu ${damage} points de dommage.`, "Continuer à explorer le donjon")
                        let btnNextSpace = document.getElementById("btnNextPlace")
                        btnNextSpace.innerHTML = `<div class="classicBtn" onclick="startGame()">Continuer à explorer le donjon</div>`
                    }, 1500)
                }
        }, 6000)
    })
}

const startFight = (fightEvent) => {
    let eventType = fightEvent.typeOfEvent
    let objective = fightEvent.dice
    let enemy = fightEvent.enemy
    let enemyPronoun = enemy.name === "Orc" ? "l'" : "le ";
    let enemyPronounCap = enemy.name === "Orc" ? "L'" : "Le ";
    displayEventDialog(eventType, `Un ${enemy.name} se dresse devant vous. Pour savoir qui de vous deux attaquera en premier, vous devez lancer un dé du Destin.`, 'lancer le dé')
    let screen = document.getElementById('screen')
    let btn = document.getElementById("eventBtn")
    btn.addEventListener('click',() => {
        let enemyDamageMax = ((enemy.str + enemy.dex + enemy.intel) / 3) * 3
        let enemyDamageMin = ((enemyDamageMax) / 4) * 3
        let enemyDamage = Math.round(Math.random() * (enemyDamageMax - enemyDamageMin) + enemyDamageMin)
        let characterScore = 0
        let enemyScore = 0
        let max = 20
        let interval = dice(screen, max)
        let btnNextSpace = document.getElementById("btnNextPlace")
        btnNextSpace.innerHTML = ""
        setTimeout(() => {
            clearInterval(interval)
            characterScore = Math.round(Math.random() * (max - 1) + 1)
            screen.innerHTML = `<div class="dice diceScore">${characterScore}</div>`
            setTimeout(() => {
                displayFightDialog(eventType, `Votre score d'initiative est de ${characterScore}. C'est désormais au tour de votre adversaire de lancer un dé.`, 'Suivant', 'enemyDice', 'enemyDiceDisplay', 'enemyDiceBtnNext')
                //enemyDiceBtnNext.innerHTML = `<div class="classicBtn" id="enemyDice">Suivant</div>`
                let enemyDice = document.getElementById('enemyDice')
                let enemyDiceDisplay = document.getElementById('enemyDiceDisplay')
                let enemyDiceBtnNext = document.getElementById('enemyDiceBtnNext')
                enemyDice.addEventListener('click', () => {
                    enemyDiceBtnNext.innerHTML = ""
                    let enemyInterval = dice(enemyDiceDisplay, max)
                    setTimeout(() => {
                        clearInterval(enemyInterval)
                        enemyScore = objective
                        enemyDiceDisplay.innerHTML = `<div class="dice diceScore">${enemyScore}</div>`
                        setTimeout(() => {
                            let whoStart
                            let isHeroStart
                            let startFightBtn
                            if(enemyScore === characterScore){
                                whoStart = `Vos scores d'initiative étant identiques, le dé du destin devra être relancé une nouvelle fois pour chacun d'entre vous...`
                                isHeroStart = false
                                startFightBtn = 'Recommencer'
                                displayFightDialog(eventType, `${enemyPronounCap}${enemy.name} vient de faire un score de ${enemyScore} lors de son jet d'initiative. ${whoStart}`, startFightBtn, 'startFightBtnId', 'startFightScreenId', 'startFightBtnNextId')
                                let startFightBtnId = document.getElementById('startFightBtnId')
                                startFightBtnId.addEventListener('click', () => {
                                    reRollDice(enemyPronounCap, enemy.name, enemy, 'startFightScreenId')
                                })
                            } else {
                                if(enemyScore > characterScore){
                                    whoStart = `Le score de votre adversaire étant supérieur au votre, c'est donc lui qui commencera à attaquer en premier.`
                                    isHeroStart = false
                                    startFightBtn = 'Commencer le combat'
                                }
                                if(enemyScore < characterScore){
                                    whoStart = `Le score de votre adversaire étant inférieur au votre, c'est vous qui commencerez à attaquer.`
                                    isHeroStart = true
                                    startFightBtn = 'Commencer le combat'
                                }
                                displayFightDialog(eventType, `${enemyPronounCap}${enemy.name} vient de faire un score de ${enemyScore} lors de son jet d'initiative. ${whoStart}`, startFightBtn, 'startFightBtnId', 'startFightScreenId', 'startFightBtnNextId')
                                let startFightBtnId = document.getElementById('startFightBtnId')
                                startFightBtnId.addEventListener('click', () => {
                                    fightSystem(eventType, enemy, isHeroStart)
                                })
                            }
                        }, 1500)
                    }, 6000)
                })
            }, 1500)
        }, 6000)
    })
}

const enemyHud = (isHurt) => {
    if(enemyState.currentHp <= 0){
        app.innerHTML = `<div id="eventDialog">
                        <div id="eventTitle">évènement en cours : Combat</div>
                        <div id="fightScreenId" class="screen">
                            <div class="fightScreen">
                            <div class="enemyName">${enemyState.name}</div>
                            <div id="lifeEnemy">
                                <div><b>PV</b></div><div id="enemyHpSquares"></div>
                            </div>
                            <div class="enemyDamage">Dégats : ${enemyState.minDamage} - ${enemyState.maxDamage}</div>   
                          </div>
                        </div>
                        <div id="dialog"></div>
                        <div class="btnNextPlace" id="fightBtnZone">
                            
                        </div>
                    </div>`
        let enemyHpSquares = document.getElementById('enemyHpSquares')
        let diffHp = enemyState.maxHp
        let fightScreenId = document.getElementById('fightScreenId')
        for (let i = 0; i < diffHp; i++) {
            enemyHpSquares.innerHTML += `<div class="hp disableHp"></div>`
        }
        fightScreenId.classList.add('shakeInput')
        setTimeout(() => {
            fightScreenId.classList.remove('shakeInput')
            enemyState = ""
        }, 1500)
        updateFightScore()
        let fightDialog = document.getElementById('dialog')
        fightDialog.innerHTML = `Félications, vous venez de vaincre ${enemyState.pronoun}${enemyState.name} ! Votre score de combat vient d'augmenter de 1 point.`
        let fightBtnZone = document.getElementById('fightBtnZone')
        fightBtnZone.innerHTML = `<div class="classicBtn" id="dungeonReturnBtn">Continuer l'exploration</div>`
        let dungeonReturnBtn = document.getElementById('dungeonReturnBtn')
        dungeonReturnBtn.addEventListener('click', () => {
            startGame()
        })
    } else {
        let diffHp = enemyState.maxHp - enemyState.currentHp
        let hpArray = [...Array(enemyState.currentHp).keys()]
        fightScreenId.innerHTML = `<div class="fightScreen">
                            <div class="enemyName">${enemyState.name}</div>
                            <div id="lifeEnemy">
                                <div><b>PV</b></div><div id="enemyHpSquares">${hpArray.map(e => { return `<div class="hp"></div>`}).join("")}</div>
                            </div>
                            <div class="enemyDamage">Dégats : ${enemyState.minDamage} - ${enemyState.maxDamage}</div>   
                          </div>`
        let enemyHpSquares = document.getElementById('enemyHpSquares')
        for (let i = 0; i < diffHp; i++) {
            enemyHpSquares.innerHTML += `<div class="hp disableHp"></div>`
        }
        if (isHurt){
            fightScreenId.classList.add('shakeInput')
            setTimeout(() => {
                fightScreenId.classList.remove('shakeInput')
            }, 1500)
        }
    }
}

const heroTurn = () => {
    app.innerHTML = `<div id="eventDialog">
                        <div id="eventTitle">évènement en cours : Combat</div>
                        <div id="fightScreenId" class="screen"></div>
                        <div id="dialog"></div>
                        <div class="btnNextPlace" id="fightBtnZone">
                            
                        </div>
                    </div>`
    let fightScreenId = document.getElementById("fightScreenId")
    let fightDialog = document.getElementById("dialog")
    let fightBtnZone = document.getElementById("fightBtnZone")
    enemyHud()
    let heroDamage = Math.floor(Math.random() * (selectedCharacter.damage.max - selectedCharacter.damage.min + 1)) + selectedCharacter.damage.min
    let randomDialog = Math.floor(Math.random() * (3 - 1 + 1)) + 1
    let dialog
    switch (randomDialog){
        case 1:
            dialog = selectedCharacter.info.class_type === 'Magie' ? `Puisant au plus profond de votre source de mana, vous vous concentrez sur ${enemyState.pronoun}${enemyState.name} et lui envoyez un arc éléctrique qui le foudroie littéralement.` : `Faisant mouliner votre arme au dessus de votre tête pour gagner en puissance, vous feintez un mouvement de coté avant de plonger sur ${enemyState.pronoun}${enemyState.name} et le frappez de toutes vos forces.`
            break
        case 2:
            dialog = selectedCharacter.info.class_type === 'Magie' ? `Vous fottez vos mains l'une contre l'autre de plus en plus. Des étincelles se mettent à jaillirent du bout de vos doigts, jusqu'à ce que finalement vos mains s'embrasent. Visant directement ${enemyState.pronoun}${enemyState.name}, vous projetez un rayon de flamme destructeur !` : `Vous reculez de quelques pas avant de vous mettre à courir et projetez tout votre corps contre ${enemyState.pronoun}${enemyState.name}. Ce dernier est violemment envoyé contre une paroi de pierre. Au moment de l'impact, vous entendez distinctement ses os craquer.`
            break
        case 3:
            dialog = selectedCharacter.info.class_type === 'Magie' ? `L'humidité qui vous entoure vous sert à préparer un puissant sort de glace. Faisant remonter l'eau des tréfonds de la terre, vous figez les pieds de votre ennemi dans la glace avant de lui envoyer des dizaines de stalactiques acérés qui le lacèrent.` : `Non sans efforts, vous parvenz à parer les attaques de votre adversaire. Profitant d'une baisse d'attention, vous lui envoyez votre coude en plein visage, ce qui le fait tomber à la renverse. Il parvient à se relever, mais alors qu'il ne peut vous contrer, vous lui assénez un coup en travers de la poitrine.`
    }
    fightDialog.innerHTML = dialog
    fightBtnZone.innerHTML = `<div class="classicBtn" id="heroTurnBtn">Suivant</div>`
    let heroTurnBtn = document.getElementById('heroTurnBtn')
    heroTurnBtn.addEventListener('click', () => {
        enemyState.currentHp -= heroDamage
        enemyHud(true)
        if (enemyState.currentHp <= 0){
            updateFightScore()
            fightDialog.innerHTML = `Félicitation, vous avez terrassé ${enemyState.pronoun}${enemyState.name} ! Votre score de combat vient d'augmenter de 1 point. Le reste du donjon vous attend.`
            fightBtnZone.innerHTML = `<div class="classicBtn" id="dungeonReturnBtn">Continuer l'exploration</div>`
            let dungeonReturnBtn = document.getElementById('dungeonReturnBtn')
            dungeonReturnBtn.addEventListener('click', () => {
                startGame()
            })
        }
        if( enemyState.currentHp > 0) {
            fightDialog.innerHTML = `A votre adversaire de tenter de vous faire mordre la poussière !`
            fightBtnZone.innerHTML = `<div class="classicBtn" id="enemyTurnBtn">Tour suivant</div>`
            let enemyTurnBtn = document.getElementById('enemyTurnBtn')
            enemyTurnBtn.addEventListener('click', () => {
                enemyTurn()
            })
        }
    })
}

const enemyTurn = () => {
    app.innerHTML = `<div id="eventDialog">
                        <div id="eventTitle">évènement en cours : Combat</div>
                        <div id="fightScreenId" class="screen"></div>
                        <div id="dialog"></div>
                        <div class="btnNextPlace" id="fightBtnZone">
                            
                        </div>
                    </div>`
    let fightScreenId = document.getElementById("fightScreenId")
    let fightDialog = document.getElementById("dialog")
    let fightBtnZone = document.getElementById("fightBtnZone")
    enemyHud()
    let enemyDamage = Math.floor(Math.random() * (enemyState.maxDamage - enemyState.minDamage + 1)) + enemyState.minDamage
    let randomDialog = Math.floor(Math.random() * (3 - 1 + 1)) + 1
    let dialog
    switch (randomDialog){
        case 1:
            dialog = enemyState.name === 'Sorcier' ? `${enemyState.pronoun}${enemyState.name} marmonne une incantation qui vous est inconnue avant de pointer un doigt vers vous. Les ombres se mettent alors à danser autour de vous et, soudainement, se mettent à vous attaquer !` : `${enemyState.pronoun}${enemyState.name} vous fixe en frappant son arme contre la paume de son autre main. Finalement, il se décide à venir vers vous et, d'un geste maladroit, vous attaque. C'est justement cette maladresse qui vous a trompé et vous a fait rouler du mauvais coté. L'arme de votre adversaire vous touhe avec violence !`
            break
        case 2:
            dialog = enemyState.name === 'Sorcier' ? `D'un geste vif, ${enemyState.pronoun}${enemyState.name} déploie sa longue cape et fait jaillir de son revers des centaines de couteaux. Vous parvenez à en esquiver certains mais êtes gravement touché.` : `${enemyState.pronoun}${enemyState.name} n'a vraiment pas apprécié votre dernière attaque. Furieux, il fonce droit sur vous et vous projette au sol. Levant ses bras au dessus de sa tête, il abat sur vous son arme alors que vous êtes à terre, sans possibilité de parer.`
            break
        case 3:
            dialog = enemyState.name === 'Sorcier' ? `Après un rire macabre qui vous glace le sang, ${enemyState.pronoun}${enemyState.name} envoie sur vous des éclairs jaillissant de ses doigts. Paralysé, vous ne pouvez que subir l'affreuse douleur ressentie.` : `Gromelant, ${enemyState.pronoun}${enemyState.name} fait mine de vous foncer dessus, mais alors que vous faites un pas de coté, vous voyez arriver en plein sur vous son arme, lancée à pleine vitesse dans votre direction. Vous êtes touché en pleine face.`
    }
    if(enemyState.name === "Dragon Rouge"){
        switch (randomDialog){
            case 1:
                dialog = `Vous toisant de toute sa hauteur, le Dragon Rouge se met à souffler du nez, laissant d'échapper de ses narines braises et fumées. Agitant sa tête telle un serpent, il se penche à votre hauteur, puis, d'un geste vif, se retourne et vous envoi valser à l'autre bout de la pièce d'un puissant coup de queue. Vos os craquent au moment de l'impact.`
                break
            case 2:
                dialog = `Bien que vous tenant à distance, vous sentez la chaleur dégagée par la bête. Elle se déplace lentement, vous tourne autour. D'un coup, elle s'arrête, lève sa tête vers le plafond et vous voyer gronder dans sa gorge de vives flemmes. Lorsque le Dragon Rouge vous regarde à nouveau, sa gueule est grande ouverte et un ouragon de flammes en jaillit !`
                break
            case 3:
                dialog = `Vous commencez à être à bout de souffle. La bête aussi. Vous esquivez tous les coups mais, un moment d'inatention vous fait trébucher. La bête en profite pour bondir sur vous et vous maintenir au sol à l'aide de l'une de ses puissantes pates. Elle vous écrase au sol. Vous parvenez à vous dégager avant qu'il ne soit trop tard mais le Dragon vous charge tel un bélier et vous heurtez le mur opposé.`
        }
    }
    fightDialog.innerHTML = dialog
    fightBtnZone.innerHTML = `<div class="classicBtn" id="enemyTurnBtn">Suivant</div>`
    let enemyTurnBtn = document.getElementById('enemyTurnBtn')
    enemyTurnBtn.addEventListener('click', () => {
        fightBtnZone.innerHTML = ""
            let characterHud = document.getElementById('characterHud')
            characterHud.classList.add("shakeInput")
            setTimeout(() => {
                characterHud.classList.remove("shakeInput")
                updateLife("less", enemyDamage)
                fightDialog.innerHTML = `A votre tour d'attaquer ${enemyState.pronoun}${enemyState.name} à présent. Pas de quartier !`
                fightBtnZone.innerHTML = `<div class="classicBtn" id="yourTurnAgainBtn">Tour suivant</div>`
                let yourTurnAgainBtn = document.getElementById('yourTurnAgainBtn')
                yourTurnAgainBtn.addEventListener('click', () => {
                    heroTurn()
                })
        }, 1000)
    })
}
const fightSystem = (typeOfEvent, enemy, isHeroStart) => {
    enemyState = {
        'pronounCap': enemy.name === "Orc" ? "L'" : "Le ",
        'pronoun': enemy.name === "Orc" ? "l'" : "le ",
        'name': enemy.name,
        'currentHp': enemy.current_hp,
        'maxHp': enemy.max_hp,
        'maxDamage': Math.round(((enemy.str + enemy.dex + enemy.intel) / 3) * 3),
        'minDamage': Math.round(((((enemy.str + enemy.dex + enemy.intel) / 3) * 3) / 4 ) * 3)
    }
    app.innerHTML = `<div id="eventDialog">
                        <div id="eventTitle">évènement en cours : ${typeOfEvent}</div>
                        <div id="fightScreenId" class="screen"></div>
                        <div id="dialog"></div>
                        <div class="btnNextPlace" id="fightBtnZone">
                            
                        </div>
                    </div>`
    let fightScreenId = document.getElementById("fightScreenId")
    let fightDialog = document.getElementById("dialog")
    let fightBtnZone = document.getElementById("fightBtnZone")
    enemyHud()
    if(isHeroStart){
        let heroFirstAttackDamage = Math.floor(Math.random() * (selectedCharacter.damage.max - selectedCharacter.damage.min + 1)) + selectedCharacter.damage.min
        let firstAttackDialog = selectedCharacter.info.class_type === 'Magie' ?
            `La magie s'éveille en vous et fait luire vos yeux dans l'obscurité de la pièce. Vous concentrez votre énergie aux creux de vos mains et formez une sphère de mana pure que vous projetez aussitôt droit vers ${enemyState.pronoun}${enemyState.name}.` :
            `Prenant un peu d'élant, vous fonçez droit vers ${enemyState.pronoun}${enemyState.name} et abattez votre arme sur lui.`
        fightDialog.innerHTML = firstAttackDialog
        fightBtnZone.innerHTML = `<div class="classicBtn" id="firstAttackBtn">Attaquer</div>`
        let firstAttackBtn = document.getElementById('firstAttackBtn')
        firstAttackBtn.addEventListener('click', () => {
            enemyState.currentHp -= heroFirstAttackDamage
            enemyHud(true)
            if (enemyState.currentHp <= 0){
                fightDialog.innerHTML = `Votre puissante attaque a eu raison de votre adversaire. ${enemyState.pronounCap}${enemyState.name} n'a plus de PV. Vous l'avez vaincu !`
                fightBtnZone.innerHTML = `<div class="classicBtn" id="dungeonReturnBtn">Attaquer</div>`
                let dungeonReturnBtn = document.getElementById('dungeonReturnBtn')
                dungeonReturnBtn.addEventListener('click', () => {
                    startGame()
                    enemyState = ""
                })
            } else {
                fightDialog.innerHTML = `Vous venez d'infliger ${heroFirstAttackDamage} de points de dégats à votre ennemi. ${enemyState.pronounCap}${enemyState.name} a encore ${enemyState.currentHp} PV. A son tour de vous attaquer.`
                fightBtnZone.innerHTML = `<div class="classicBtn" id="enemyFirstAttackBtn">Tour de l'adversaire</div>`
                let enemyFirstAttackBtn = document.getElementById('enemyFirstAttackBtn')
                enemyFirstAttackBtn.addEventListener('click', () => {
                    enemyTurn()
                })
            }
        })
    } else {
        let enemyFirstAttackDamage = Math.floor(Math.random() * (enemyState.maxDamage - enemyState.minDamage + 1)) + enemyState.minDamage
        fightDialog.innerHTML = `Vous recevez un coup violent. ${enemyState.pronounCap}${enemyState.name} vous inflige ${enemyFirstAttackDamage} de points de dégâts.`
        let hud = document.getElementById("characterHud")
        setTimeout(() => {
            fightBtnZone.innerHTML = ""
            hud.classList.add("shakeInput")
            setTimeout(() => {
                hud.classList.remove("shakeInput")
                updateLife("less", enemyFirstAttackDamage)
                fightBtnZone.innerHTML = `<div class="classicBtn" id="enemyFirstAttackBtn">Suivant</div>`
                let enemyFirstAttackBtn = document.getElementById('enemyFirstAttackBtn')
                enemyFirstAttackBtn.addEventListener('click', () => {
                    fightDialog.innerHTML = `C'est désormais votre tour d'attaquer !`
                    fightBtnZone.innerHTML = `<div class="classicBtn" id="yourTurn">Attaquer</div>`
                    let yourTurn = document.getElementById('yourTurn')
                    yourTurn.addEventListener('click', () => {
                        heroTurn()
                    })
                })
            }, 1000)
        }, 2000)
    }
}

const reRollDice = (enemyPronounCap, enemyName, enemy) => {
    displayFightDialog('Combat', "C'est à votre tour de relancer le dé du Destin. Espérons que cette fois la Chance verra en vous son Champion...", "Relancer le dé", 'reRollDiceId', 'reRollScreenId', 'reRollNextPlaceId')
    let reRollDiceId = document.getElementById('reRollDiceId')
    let reRollScreenId = document.getElementById('reRollScreenId')
    let reRollNextPlaceId = document.getElementById('reRollNextPlaceId')
    reRollDiceId.addEventListener('click', () => {
        reRollNextPlaceId.innerHTML = ""
        let characterScore
        let reRollDice = dice(reRollScreenId, 20)
        setTimeout(() => {
            clearInterval(reRollDice)
            characterScore = Math.round(Math.random() * (20 - 1) + 1)
            reRollScreenId.innerHTML = `<div class="dice diceScore">${characterScore}</div>`
            setTimeout(() => {
                displayFightDialog('Combat', `Vous venez d'obtenir un score d'intiative de ${characterScore}. Au tour de votre opposant de relancer un dé.`, 'Suivant', 'reRollEnemyBtn', 'reRollEnemyScreen', 'reRollEnemyPlace')
                let reRollEnemyBtn = document.getElementById('reRollEnemyBtn')
                let reRollEnemyScreen = document.getElementById('reRollEnemyScreen')
                let reRollEnemyPlace = document.getElementById('reRollEnemyPlace')
                reRollEnemyBtn.addEventListener('click', () => {
                    reRollEnemyPlace.innerHTML = ""
                    let enemyReRoll = dice(reRollEnemyScreen, 20)
                    setTimeout(() => {
                        clearInterval(enemyReRoll)
                        let enemyScore = Math.round(Math.random() * (20 - 1) + 1)
                        //let enemyScore = characterScore
                        reRollEnemyScreen.innerHTML = `<div class="dice diceScore">${enemyScore}</div>`
                        setTimeout(() => {
                            let whoStart
                            let isHeroStart
                            let startFightBtn
                            if(enemyScore === characterScore){
                                whoStart = `Vos scores sont à nouveau identiques. Le dé du destin devra une nouvelle fois être relancé... A un moment ou un autre, un premier attaquant sera désigné...`
                                isHeroStart = false
                                startFightBtn = 'Recommencer'
                                displayFightDialog("Combat", `${enemyPronounCap}${enemyName} a obtenu un score de ${enemyScore} lors de son jet d'initiative. ${whoStart}`, startFightBtn, 'startFightBtnId', 'startFightScreenId', 'startFightBtnNextId')
                                let startFightBtnId = document.getElementById('startFightBtnId')
                                startFightBtnId.addEventListener('click', () => {
                                    displayFightDialog('Combat', `Bon, attendez. On ne va quand même pas y passer la partie. Je vous accorde un bonus exceptionnel de +1 au jet de dé. Votre score est désormais de ${characterScore+1}, c'est à vous d'attaquer en premier.`, 'Commencer le combat', 'startFightBtnId2', 'startFightScreenId2', 'startFightBtnId2')
                                    let startFightBtnId2 = document.getElementById('startFightBtnId2')
                                    startFightBtnId2.addEventListener('click', () => {
                                        fightSystem('Combat', enemy, isHeroStart)
                                    })
                                })
                            } else {
                                if(enemyScore > characterScore){
                                    whoStart = `Le score de votre adversaire étant cette fois supérieur au votre, c'est lui qui commencera à attaquer en premier.`
                                    isHeroStart = false
                                    startFightBtn = 'Commencer le combat'
                                }
                                if(enemyScore < characterScore){
                                    whoStart = `Le score de votre adversaire étant cette fois inférieur au votre, c'est vous qui commencerez à attaquer.`
                                    isHeroStart = true
                                    startFightBtn = 'Commencer le combat'
                                }
                                displayFightDialog('Combat', `${enemyPronounCap}${enemyName} vient de faire un score de ${enemyScore} lors de son jet d'initiative. ${whoStart}`, startFightBtn, 'startFightBtnId', 'startFightScreenId', 'startFightBtnNextId')
                                let startFightBtnId = document.getElementById('startFightBtnId')
                                startFightBtnId.addEventListener('click', () => {
                                    fightSystem('Combat', enemy, isHeroStart)
                                })
                            }
                        }, 1500)
                    }, 6000)
                })
            }, 1500)
        }, 6000)
    })
}

const dice = (screen, max) => {
    return setInterval(() => {
        let n = Math.round(Math.random() * (max - 1) + 1)
        let number = n.toString()
        screen.innerHTML = `<div class="dice">${number}</div>`
    }, 200)
}



const startEvent = (type) => {
    fetch(`http://${ip}?create=event&type=${type}`)
        .then(res => res.json())
        .then(res => {
            displayHud(selectedCharacter.info.id);
            let type = res.typeOfEvent;
            // displayEventDialog()
            // let eventTitle = document.getElementById('eventTitle')
            // let eventScreen = document.getElementById('screen')
            // let eventDialog = document.getElementById('dialog')
            // let eventBtn = document.getElementById('eventBtn')
            // eventTitle.innerHTML = res.typeOfEvent;

            displayEventDialog(res.typeOfEvent, res.script.script1, "suivant")
            let eventBtn = document.getElementById('eventBtn')
            eventBtn.addEventListener("click", () => {
                displayEventDialog(res.typeOfEvent, res.script.script2, "suivant")
                let eventBtn = document.getElementById('eventBtn')
                eventBtn.addEventListener("click", () => {
                    displayEventDialog(res.typeOfEvent, res.script.script3, "suivant")
                    let eventBtn = document.getElementById('eventBtn')
                    eventBtn.addEventListener("click", () => {
                        switch (type){
                            case "Coffre":
                                startChest(res);
                                break
                            case "Piège":
                                startTrap(res);
                                break
                            case "Combat":
                                startFight(res)
                                break
                            case "Rencontre":
                                startEncounter(res)
                                break
                        }
                    })
                })
            })
        })
}

const startEncounter = (encounterEvent) => {
    displayFightDialog('Rencontre', `Quel objet allez vous choisir entre ${encounterEvent.object[0].name} et ${encounterEvent.object[1].name} ? Vous ne pouvez en garder qu'un, choisissez méticuleusement...`, '', '', '', "chooseObjectBtn")
    let chooseObjectBtn = document.getElementById('chooseObjectBtn')
    chooseObjectBtn.innerHTML = `<div class="classicBtn" id="object1">${encounterEvent.object[0].name}</div>
                                 <div class="classicBtn" id="object2">${encounterEvent.object[1].name}</div>`
    let object1Btn = document.getElementById('object1')
    let object2Btn = document.getElementById('object2')
    object1Btn.addEventListener('click', () => {
        let dialog = document.getElementById('dialog')
        dialog.innerHTML = `Vous avez choisi ${encounterEvent.object[0].name}. Vous vous en emparez et le placez dans votre sac. Lorsque vous relevez la tête, l'Etranger a disparu. Plus aucune trace de sa visite ne persiste. Vous commencez même à douter de ne l'avoir jamais croisé.`
        updateInventory(selectedCharacter.info.id, encounterEvent.object[0].id, "more", 1)
        chooseObjectBtn.innerHTML = `<div class="classicBtn" onclick="startGame()">Continuer à explorer le donjon</div>`
    })
    object2Btn.addEventListener('click', () => {
        let dialog = document.getElementById('dialog')
        dialog.innerHTML = `Vous avez choisi ${encounterEvent.object[1].name}. Vous vous en emparez et le placez dans votre sac. Lorsque vous relevez la tête, l'Etranger a disparu. Plus aucune trace de sa visite ne persiste. Vous commencez même à douter de ne l'avoir jamais croisé.`
        updateInventory(selectedCharacter.info.id, encounterEvent.object[1].id, "more", 1)
        chooseObjectBtn.innerHTML = `<div class="classicBtn" onclick="startGame()">Continuer à explorer le donjon</div>`
    })
}

const save = (characterState) => {
    selectedCharacter = characterState
    localStorage.setItem('localCharacter', JSON.stringify(characterState))
}
const displayHud = (characterId, isHurt) => {
    fetch(`http://${ip}?find=character&id=${characterId}`)
        .then(res => res.json())
        .then(res => {
            save(res)
            let maxHp = res.info.max_hp
            let currentHp = res.info.current_hp
            let diffHp = maxHp - currentHp
            let hpArray = [...Array(currentHp).keys()];
            let str = res.info.str
            let dex = res.info.dex
            let int = res.info.intel
            let equipment = res.equipment
            let hudArmor = 'hudElement'
            let hudWeapon = 'hudElement'
            let hudInventory = 'hudElement'
            let armor = {
                'name': equipment.armor_name,
                'id' : equipment.armor_id,
                }
                if(armor.name === null){
                    armor.name = "Aucune armure"
                    hudArmor = "disabledHudElement"
                }
            let weapon = {
                'name': equipment.weapon_name,
                'id' : equipment.weapon_id
                }
                if(weapon.name === null){
                    weapon.name = "Aucune arme"
                    hudWeapon = 'disabledHudElement'
                }
            let inventory = res.inventory
            if (inventory.length === 0){
                inventory = [{'object_name': "Sac vide",
                                'quantity': "",
                                "object_id": 0}]
                hudInventory = "disabledHudElement"
            }
            hud.innerHTML = `<div id="inventoryHud">
                            <h3>Inventaire</h3>
                            ${inventory.map(e => {
                                let qty = e.quantity
                                qty !== "" ? qty = "(x"+qty+")" : qty = ""
                                if (e.object_name === "Sac vide"){
                                    return `<div class=${hudInventory} id="inventory${e.object_id}">${e.object_name} ${qty}</div>`
                                } else {
                                    return `<div class=${hudInventory} onclick="inventoryModal('${e.object_id}')" id="inventory${e.object_id}">${e.object_name} ${qty}</div>`   
                                }
                            }).join("")}
                            </div>
                            <div id="characterHud">
<!--                                <div class="characterName">${res.info.name}</div> :-->
                                <div title="PV : ${currentHp} / ${maxHp}" id="lifeCharacter"><p><b>PV</b></p><div id="hpSquares">
                                                                        ${hpArray.map(e => {
                                                                            return `<div class="hp"></div>`
                                                                        }).join("")}
                                                                    </div>
                                </div>
                                <div id="str"><b>For</b> ${str}</div>
                                <div id="dex"><b>Dex</b> ${dex}</div>
                                <div id="int"><b>Int</b> ${int}</div>
                            </div>
                            <div id="equipmentHud">
                                <h3>Equipement</h3>
                                <div id="armor${armor.id}" class="${hudArmor}">${armor.name}</div>
                                <div id="weapon${weapon.id}" class="${hudWeapon}">${weapon.name}</div>
                            </div>`
            let armorClick = document.getElementById(`armor${armor.id}`)
            let weaponClick = document.getElementById(`weapon${weapon.id}`)
            if(armor.name !== "Aucune armure"){
                armorClick.addEventListener('click', () => {
                    equipmentModal(armor.id, "Armure")
                })
            }
            if(weapon.name !== "Aucune arme"){
                weaponClick.addEventListener('click', () => {
                    equipmentModal(weapon.id, "Arme")
                })
            }
            if(diffHp !== 0){
                let hpSquares = document.getElementById("hpSquares")
                // let diffHpArray = [...Array(diffHp).keys()];
                // diffHpArray.map(hp => {
                //     return hpSquares.innerHTML += `<div class="hp disableHp"></div>`
                // })
                for (let i = 0; i < diffHp; i++) {
                    hpSquares.innerHTML += `<div class="hp disableHp"></div>`
                }
            }
            if (isHurt){
                let hud = document.getElementById('characterHud')
                hud.classList.add('shakeInput')
                setTimeout(() => {
                    hud.classList.remove('shakeInput')
                }, 1000)
            }
            if (currentHp <= 0){
                death(0)
            }

        })
}

const death = (timeout) => {
    setTimeout(() => {
        modal.innerHTML = ""
        modal.classList.remove('hideModal')
        modal.classList.add('deathModal')
        modal.innerHTML += `<div class="topModal"></div>
                        <div class="titleModalDeath"></div>
                        <div class="descriptionModalDeath">
                            <div>Vous êtes mort !</div>
                        </div>
                        <div id="zoneBtnModal">
                            <div class="classicBtn" onclick="location.reload()">Retourner à l'écran d'accueil</div>
                        </div>`
    }, timeout)
}

startSelection();

//displayHud(43)
//displayEventDialog()


