
var EXPLOIT_DATA_URL = "https://raw.githubusercontent.com/davidsaltacc/exploits-data/main/exploits.json";
var MALWARE_DATA_URL = "https://raw.githubusercontent.com/davidsaltacc/exploits-data/main/viruses-rats-fakes.json";
var BYPASSERS_DATA_URL = "https://raw.githubusercontent.com/davidsaltacc/exploits-data/main/bypassers.json";
var ADBLOCKERS_DATA_URL = "https://raw.githubusercontent.com/davidsaltacc/exploits-data/main/adblockers.json";
var ISSUE_DATA_URL = "https://api.github.com/repos/davidsaltacc/exploits-data/issues";
var UPDATE_DATA_URL = "https://rear-olwen-rsploits-4f8dc15e.koyeb.app/roblox-version";
// USAGE OF THE ABOVE APIs IS PROHIBITED FOR ANYTHING OR ANYONE BESIDES RSPLOITS.GITHUB.IO WITHOUT PROPER CREDITING. 
// USAGE ALLOWANCE CAN BE REVOKED BY THE OWNER AT ANY TIME.

var el = x => document.getElementById(x);

function fetchNoCaching(url) {
    return fetch(url);
}

function changeTab(name, button) { // very messy but works
    el("exploits").style.display = "none";
    el("viruses").style.display = "none";
    el("bypassers").style.display = "none";
    el("adblockers").style.display = "none";
    el("credits").style.display = "none";
    el("editor").style.display = "none";
    el("issues").style.display = "none";
    el(name).style.display = "flex";
    el("nav_exploits_button").className = "";
    el("nav_viruses_button").className = "";
    el("nav_bypassers_button").className = "";
    el("nav_adblockers_button").className = "";
    el("nav_credits_button").className = "";
    el("nav_editor_button").className = "";
    el("nav_issues_button").className = "";
    button.className = "active";
}

function toggleFilterMenu() {
    var filter = el("filter");
    if (filter.style.transform == "translate(0px, -150px)") {
        filter.style.transform = "";
    } else {
        filter.style.transform = "translate(0px, -150px)";
    }
}

var activeFilters = [];

function toggleFilter(name, button) {

    if (button.className.includes(" active")) {
        button.className = button.className.replace(" active", "");
    } else {
        button.className += " active";
    }
    if (activeFilters.includes(name)) {
        activeFilters = activeFilters.filter(item => item !== name);
    } else {
        activeFilters.push(name);
    }

    var allCards = Array.from(document.getElementsByClassName("excard"));

    var activePlatformFilters = [];
    var activeFeatureFilters = [];

    activeFilters.forEach(f => {
        if (["ex_keyless", "ex_free", "ex_decomp"].includes(f)) {
            activeFeatureFilters.push(f);
        } else {
            activePlatformFilters.push(f);
        }
    });

    allCards.forEach(c => c.style.display = "none");

    var remainingCards = [];
    allCards.forEach(c => {

        var visible = false;
        if (activePlatformFilters.length == 0) {
            visible = true;
        } else {
            activePlatformFilters.forEach(f => {
                if (c.className.includes(f)) {
                    visible = true;
                }
            });
        }
        
        if (visible) {
            c.style.display = "flex";
            remainingCards.push(c);
        } else {
            c.style.display = "none";
        }

    });
    allCards = remainingCards;

    allCards.forEach(c => {
        var visible = true;
        activeFeatureFilters.forEach(f => {
            if (!c.className.includes(f)) {
                visible = false;
            }
        });

        if (visible) {
            c.style.display = "flex";
        } else {
            c.style.display = "none";
        }

    });

}

function toggleNav() {
    document.cookie = "hidepopup=true";
    el("hamburgerpopup").style.display = "none";
    var sidebar = el("sidebar");
    var overlay = el("overlay");
    if (sidebar.style.left == "-100vw") {
        sidebar.style.left = "0";
        overlay.style.display = "block";
        overlay.style.backgroundColor = "#000000b0";
    } else {
        sidebar.style.left = "-100vw";
        overlay.style.display = "none";
        overlay.style.backgroundColor = "#00000000";
    }
}

el("overlay").onclick = () => {
    sidebar.style.left = "-100vw";
    overlay.style.display = "none";
    overlay.style.backgroundColor = "#00000000";
};

function createCard(data) {

    var title = data.title;
    var platforms = data.platforms;
    var pros = data.pros;
    var neutrals = data.neutrals;
    var cons = data.cons;
    var unc = data.unc;
    var level = data.level;
    var decompiler = data.features?.decompiler;
    var keyless = data.features?.keyless;
    var free = data.features?.free;
    var buttonName = data.buttonName;
    var buttonUrl = data.buttonUrl;
    
    var cardDiv = document.createElement("div");
    document.getElementById("exploitcontainer").appendChild(cardDiv);
    cardDiv.className = "excard";
    platforms.forEach(p => cardDiv.classList.add("ex_" + p.substring(0, 3)));

    if (keyless) { cardDiv.classList.add("ex_keyless"); }
    if (free) { cardDiv.classList.add("ex_free"); }
    if (decompiler) { cardDiv.classList.add("ex_decomp"); }

    var cardContent = document.createElement("div");
    cardDiv.appendChild(cardContent);
    cardContent.className = "content";

    var cardTitle = document.createElement("h1");
    cardContent.appendChild(cardTitle);
    cardTitle.className = "exname";
    cardTitle.innerHTML = title;
    cardTitle.appendChild(document.createElement("hr"));

    var proConDiv = document.createElement("div");
    cardContent.appendChild(proConDiv);
    proConDiv.className = "exprocon";

    [["g", pros], ["n", neutrals], ["b", cons]].forEach(c => {
        c[1].forEach(t => {
            var p = document.createElement("p");
            p.innerHTML = "- " + t;
            proConDiv.appendChild(p);
            p.className = c[0];
        });
    });

    var metaDiv = document.createElement("div");
    cardContent.appendChild(metaDiv);
    metaDiv.className = "exmeta";

    [["UNC", unc], ["Level", level]].forEach(d => {
        var dataDiv = document.createElement("div");
        metaDiv.appendChild(dataDiv);
        metaDiv.appendChild(document.createElement("hr"));
        dataDiv.className = "exdata";
        var label = document.createElement("p");
        dataDiv.appendChild(label);
        label.className = "exdatalabel";
        label.innerHTML = d[0];
        var value = document.createElement("p");
        dataDiv.appendChild(value);
        value.className = "exdatavalue";
        value.innerHTML = d[1];
    });

    var platformsDiv = document.createElement("div");
    cardContent.appendChild(platformsDiv);
    platformsDiv.className = "explatforms";

    var platformIconContainer = document.createElement("div");
    platformsDiv.appendChild(platformIconContainer);
    platformsDiv.appendChild(document.createElement("hr"));
    platformIconContainer.className = "explatformsiconcontainer";

    platforms.forEach(p => {
        var icon = document.createElement("div");
        platformIconContainer.appendChild(icon);
        icon.className = "icon " + p;
    });

    var featuresDiv = document.createElement("div");
    cardContent.appendChild(featuresDiv);
    featuresDiv.className = "exfeatures";

    var decompilerP = document.createElement("p");
    featuresDiv.appendChild(decompilerP);
    decompilerP.className = decompiler ? "g" : "b";
    decompilerP.innerHTML = "Decompiler";

    featuresDiv.appendChild(document.createElement("hr"));

    var freeP = document.createElement("p");
    featuresDiv.appendChild(freeP);
    freeP.className = free ? "g" : "b";
    freeP.innerHTML = "Free";

    featuresDiv.appendChild(document.createElement("hr"));

    var keylessP = document.createElement("p");
    featuresDiv.appendChild(keylessP);
    keylessP.className = keyless ? "g" : "b";
    keylessP.innerHTML = "Keyless";

    var button = document.createElement("button");
    cardContent.appendChild(button);
    button.innerHTML = buttonName;
    button.onmousedown = e => {
        if ([0, 1].includes(e.button)) {
            window.open(buttonUrl);
        }
    };

}

function createAllCardsFromJson(data) {
    var json = JSON.parse(data);
    for (card of json) {
        createCard(card);
    }
}

var editorCardData = {};
var editorCardIndex = 0;

function createEditableCard(data, id) {

    var title = data.title;
    var platforms = data.platforms;
    var pros = data.pros;
    var neutrals = data.neutrals;
    var cons = data.cons;
    var unc = data.unc;
    var level = data.level;
    var decompiler = data.features?.decompiler;
    var keyless = data.features?.keyless;
    var free = data.features?.free;
    var buttonName = data.buttonName;
    var buttonUrl = data.buttonUrl;
    
    var cardDiv = document.createElement("div");
    document.getElementById("editorCardContainer").appendChild(cardDiv);
    cardDiv.className = "excard editorcard";
    cardDiv.id = id;

    var cardContent = document.createElement("div");
    cardDiv.appendChild(cardContent);
    cardContent.className = "content";

    var cardTitle = document.createElement("h1");
    cardContent.appendChild(cardTitle);
    cardTitle.className = "exname";
    
    var titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.spellcheck = "false";
    titleInput.value = title;
    cardTitle.appendChild(titleInput);
    cardTitle.appendChild(document.createElement("hr"));
    titleInput.addEventListener("input", e => {
        editorCardData[cardDiv.id].title = titleInput.value;
    });

    var cardControlsContainer = document.createElement("div");
    cardContent.append(cardControlsContainer);
    cardControlsContainer.className = "editorCardControlsContainer";

    var upButton = document.createElement("button");
    cardControlsContainer.appendChild(upButton);
    upButton.className = "up";
    upButton.addEventListener("click", e => {

        if (cardDiv.previousElementSibling) {

            var oldId = cardDiv.id;
            cardDiv.id = cardDiv.previousElementSibling.id;
            cardDiv.previousElementSibling.id = oldId;
            cardDiv.parentElement.insertBefore(cardDiv, cardDiv.previousElementSibling);
            var newId = cardDiv.id;

            var oldData = editorCardData[oldId];
            editorCardData[oldId] = editorCardData[newId];
            editorCardData[newId] = oldData;

        }

    });

    var downButton = document.createElement("button");
    cardControlsContainer.appendChild(downButton);
    downButton.className = "down";
    downButton.addEventListener("click", e => {

        if (cardDiv.nextElementSibling) {

            var oldId = cardDiv.id;
            cardDiv.id = cardDiv.nextElementSibling.id;
            cardDiv.nextElementSibling.id = oldId;
            cardDiv.parentElement.insertBefore(cardDiv.nextElementSibling, cardDiv);
            var newId = cardDiv.id;

            var oldData = editorCardData[oldId];
            editorCardData[oldId] = editorCardData[newId];
            editorCardData[newId] = oldData;

        }

    });

    var removeButton = document.createElement("button");
    cardControlsContainer.appendChild(removeButton);
    removeButton.className = "remove";
    removeButton.addEventListener("click", e => {
        delete editorCardData[cardDiv.id];
        cardDiv.remove();
    });

    var proConDiv = document.createElement("div");
    cardContent.appendChild(proConDiv);
    proConDiv.className = "exprocon";

    [["g", pros], ["n", neutrals], ["b", cons]].forEach(c => {

        function editedProCons() {

            var proCons = {
                "g": [], "n": [], "b": []
            };
            for (var p of proConDiv.getElementsByTagName("p")) {
                proCons[p.className].push(p.getElementsByTagName("input").item(0).value);
            }
            
            [["pros", "g"], ["neutrals", "n"], ["cons", "b"]].forEach(c => {
                editorCardData[cardDiv.id][c[0]] = proCons[c[1]];
            });

        }

        function createProConP(type, value) {

            var p = document.createElement("p");
            p.className = type;

            var removeButton = document.createElement("button");
            removeButton.className = "removeprocon";
            removeButton.innerHTML = "-";
            p.appendChild(removeButton);

            var proconInput = document.createElement("input");
            p.appendChild(proconInput);
            proconInput.type = "text";
            proconInput.spellcheck = "false";
            proconInput.value = value;

            removeButton.addEventListener("click", e => {
                p.remove();
                editedProCons();
            });
            proconInput.addEventListener("input", e => {
                editedProCons();
            });

            return p;

        }

        c[1].forEach(a => {
            proConDiv.appendChild(createProConP(c[0], a));
        });

        var addButton = document.createElement("button");
        proConDiv.appendChild(addButton);
        addButton.className = "add" + c[0].toUpperCase();
        addButton.innerHTML = "+";
        addButton.addEventListener("click", e => {
            proConDiv.insertBefore(createProConP(c[0], ""), addButton);
            editedProCons();
        });

    });

    var metaDiv = document.createElement("div");
    cardContent.appendChild(metaDiv);
    metaDiv.className = "exmeta";

    [["UNC", unc], ["Level", level]].forEach(d => {

        var dataDiv = document.createElement("div");
        metaDiv.appendChild(dataDiv);
        metaDiv.appendChild(document.createElement("hr"));
        dataDiv.className = "exdata";

        var label = document.createElement("p");
        dataDiv.appendChild(label);
        label.className = "exdatalabel";
        label.innerHTML = d[0];

        var value = document.createElement("p");
        dataDiv.appendChild(value);
        var valueInput = document.createElement("input");
        value.append(valueInput);
        valueInput.type = "text";
        valueInput.spellcheck = "false";
        valueInput.value = d[1];
        valueInput.addEventListener("input", e => {
            editorCardData[cardDiv.id][d[0].toLowerCase()] = valueInput.value;
        });
        value.className = "exdatavalue";

    });

    var platformsDiv = document.createElement("div");
    cardContent.appendChild(platformsDiv);
    platformsDiv.className = "explatforms";

    var platformIconContainer = document.createElement("div");
    platformsDiv.appendChild(platformIconContainer);
    platformsDiv.appendChild(document.createElement("hr"));
    platformIconContainer.className = "explatformsiconcontainer";

    ["windows", "android", "macos", "ios"].forEach(p => {
        var icon = document.createElement("div");
        platformIconContainer.appendChild(icon);
        icon.className = "icon " + p + (platforms.includes(p) ? " en" : " dis") + "abled";
        icon.addEventListener("click", e => {
            if (platforms.includes(p)) {
                platforms.splice(platforms.indexOf(p), 1);
            } else {
                platforms.push(p);
            }
            var sortOrder = ["windows", "android", "macos", "ios"];
            platforms.sort((a, b) => sortOrder.indexOf(a) - sortOrder.indexOf(b));
            icon.className = "icon " + p + (platforms.includes(p) ? " en" : " dis") + "abled";
        });
    });

    var featuresDiv = document.createElement("div");
    cardContent.appendChild(featuresDiv);
    featuresDiv.className = "exfeatures";

    var decompilerP = document.createElement("p");
    featuresDiv.appendChild(decompilerP);
    decompilerP.className = decompiler ? "g" : "b";
    decompilerP.innerHTML = "Decompiler";

    var decompilerCheckbox = document.createElement("input");
    featuresDiv.appendChild(decompilerCheckbox);
    decompilerCheckbox.type = "checkbox";
    decompilerCheckbox.checked = decompiler;
    decompilerCheckbox.addEventListener("input", e => {
        editorCardData[cardDiv.id].features.decompiler = decompilerCheckbox.checked;
        decompilerP.className = decompilerCheckbox.checked ? "g" : "b";
    });

    featuresDiv.appendChild(document.createElement("hr"));

    var freeP = document.createElement("p");
    featuresDiv.appendChild(freeP);
    freeP.className = free ? "g" : "b";
    freeP.innerHTML = "Free";

    var freeCheckbox = document.createElement("input");
    featuresDiv.appendChild(freeCheckbox);
    freeCheckbox.type = "checkbox";
    freeCheckbox.checked = free;
    freeCheckbox.addEventListener("input", e => {
        editorCardData[cardDiv.id].features.free = freeCheckbox.checked;
        freeP.className = freeCheckbox.checked ? "g" : "b";
    });

    featuresDiv.appendChild(document.createElement("hr"));

    var keylessP = document.createElement("p");
    featuresDiv.appendChild(keylessP);
    keylessP.className = keyless ? "g" : "b";
    keylessP.innerHTML = "Keyless";

    var keylessCheckbox = document.createElement("input");
    featuresDiv.appendChild(keylessCheckbox);
    keylessCheckbox.type = "checkbox";
    keylessCheckbox.checked = keyless;
    keylessCheckbox.addEventListener("input", e => {
        editorCardData[cardDiv.id].features.keyless = keylessCheckbox.checked;
        keylessP.className = keylessCheckbox.checked ? "g" : "b";
    });

    var button = document.createElement("button");
    cardContent.appendChild(button);
    
    var buttonNameInput = document.createElement("input");
    button.appendChild(buttonNameInput);
    buttonNameInput.type = "text";
    buttonNameInput.spellcheck = "false";
    buttonNameInput.value = buttonName;
    buttonNameInput.addEventListener("input", e => {
        editorCardData[cardDiv.id].buttonName = buttonNameInput.value;
    });

    var buttonUrlInput = document.createElement("input");
    button.appendChild(buttonUrlInput);
    buttonUrlInput.className = "buttonUrl";
    buttonUrlInput.type = "text";
    buttonUrlInput.spellcheck = "false";
    buttonUrlInput.value = buttonUrl;
    buttonUrlInput.addEventListener("input", e => {
        editorCardData[cardDiv.id].buttonUrl = buttonUrlInput.value;
    });
}

function createAllEditableCardsFromJson(data) {
    document.getElementById("editorCardContainer").innerHTML = "";
    var json = JSON.parse(data);
    editorCardIndex = 0;
    for (card of json) {
        createEditableCard(card, editorCardIndex);
        editorCardData[editorCardIndex] = card;
        editorCardIndex++;
    }
}

function addNewEditableCard() {
    var data = {
        title: "Placeholder Title",
        platforms: [],
        pros: [],
        neutrals: [],
        cons: [],
        unc: "Placeholder UNC",
        level: "Placeholder Level",
        features: {
            decompiler: false,
            free: false,
            keyless: false
        },
        buttonName: "Placeholder Button",
        buttonUrl: "Placeholder URL"
    }
    createEditableCard(data, editorCardIndex);
    editorCardData[editorCardIndex] = data;
    editorCardIndex++;
}

function exportEditorCardsToJson() {
    var exploitList = Object.keys(editorCardData).map(Number).sort((a, b) => a - b).map(key => editorCardData[key]); 

    var exportContainer = el("exportContainer");
    exportContainer.style.display = "flex";

    el("exportTextArea").value = JSON.stringify(exploitList);
}

function importEditorCardsFromJson() {
    var importContainer = el("importContainer");
    importContainer.style.display = "flex";
}

function autoImportEditableCards() {
    fetchNoCaching(EXPLOIT_DATA_URL).then(data => data.text()).then(createAllEditableCardsFromJson);
}

function createIssueCard(data) {

    var title = data.title;
    var text = data.body;
    var date = data.created_at;
    var author = data.user.login;
    var url = data.html_url;

    var card = document.createElement("div");
    el("issues").appendChild(card);
    card.className = "card issue";

    var content = document.createElement("div");
    card.appendChild(content);
    content.className = "content";

    var issueDate = document.createElement("div");
    content.appendChild(issueDate);
    issueDate.className = "issuedate";
    issueDate.innerHTML = "Opened on: " + new Date(date).toLocaleString();

    var issueAuthor = document.createElement("div");
    content.appendChild(issueAuthor);
    issueAuthor.className = "issueauthor";
    issueAuthor.innerHTML = "Opened by: " + author;

    var titleH2 = document.createElement("h2");
    content.appendChild(titleH2);
    titleH2.innerHTML = title;
    
    span = document.createElement("span"); 
    titleH2.appendChild(span);
    span.className = "openongithubbutton";
    span.innerHTML = "Open on github";
    span.onmousedown = e => {
        if ([0, 1].includes(e.button)) {
            window.open(url);
        }
    };

    content.appendChild(document.createElement("hr"));

    var textDiv = document.createElement("div");
    content.appendChild(textDiv);
    textDiv.className = "text";
    textDiv.innerHTML = text.replaceAll("\n", "<br>");

}

function createAllIssueCardsFromJson(data) {
    var json = JSON.parse(data);
    if (json.length > 0) {
        el("issuetitle").innerHTML = "There are some open issues or suggestions";
    }
    for (issue of json) {
        createIssueCard(issue);
    }
}


function createMalwareCard(data) {
    var title = data.title;
    var description = data.description;
    var proofs = data.proofs;

    var cardDiv = document.createElement("div");
    document.getElementById("viruses").appendChild(cardDiv);
    cardDiv.className = "card virus";

    var cardContent = document.createElement("div");
    cardDiv.appendChild(cardContent);
    cardContent.className = "content";

    var name = document.createElement("h1");
    cardContent.appendChild(name);
    name.innerHTML = title;

    cardContent.appendChild(document.createElement("hr"));

    var textDiv = document.createElement("div");
    cardContent.appendChild(textDiv);
    textDiv.className = "text";

    var descriptionP = document.createElement("p");
    textDiv.appendChild(descriptionP);
    descriptionP.innerHTML = description;

    proofs.forEach(p => {
        var proofA = document.createElement("a");
        textDiv.appendChild(proofA);
        proofA.href = p;
        proofA.target = "_blank";
        proofA.rel = "noopener";
        proofA.innerHTML = "More...<br>";
    });

}

function createAllMalwareCardsFromJson(data) {
    var json = JSON.parse(data);
    for (malware of json) {
        createMalwareCard(malware);
    }
}

function createBypasserCard(data) {
    var title = data.title;
    var description = data.description;
    var buttons = data.buttons;

    var cardDiv = document.createElement("div");
    document.getElementById("bypassers").appendChild(cardDiv);
    cardDiv.className = "card bypass";

    var cardContent = document.createElement("div");
    cardDiv.appendChild(cardContent);
    cardContent.className = "content";

    var name = document.createElement("h1");
    cardContent.appendChild(name);
    cardContent.appendChild(document.createElement("hr"));
    name.innerHTML = title;

    var textDiv = document.createElement("div");
    cardContent.appendChild(textDiv);
    textDiv.className = "text";

    description.forEach(d => {
        var descriptionP = document.createElement("p");
        textDiv.appendChild(descriptionP);
        descriptionP.innerHTML = d;
    });

    buttons.forEach(b => {
        var button = document.createElement("button");
        textDiv.appendChild(button);
        button.innerHTML = b.name;
        button.onmousedown = e => {
            if ([0, 1].includes(e.button)) {
                window.open(b.url);
            }
        };
    });
}

function createAllBypasserCardsFromJson(data) {
    var json = JSON.parse(data);
    for (bypasser of json) {
        createBypasserCard(bypasser);
    }
}


function createAdblockerCard(data) {
    var title = data.title;
    var description = data.description;
    var buttons = data.buttons;

    var cardDiv = document.createElement("div");
    document.getElementById("adblockers").appendChild(cardDiv);
    cardDiv.className = "card adblocker";

    var cardContent = document.createElement("div");
    cardDiv.appendChild(cardContent);
    cardContent.className = "content";

    var name = document.createElement("h1");
    cardContent.appendChild(name);
    cardContent.appendChild(document.createElement("hr"));
    name.innerHTML = title;

    var textDiv = document.createElement("div");
    cardContent.appendChild(textDiv);
    textDiv.className = "text";

    description.forEach(d => {
        var descriptionP = document.createElement("p");
        textDiv.appendChild(descriptionP);
        descriptionP.innerHTML = d;
    });

    buttons.forEach(b => {
        var button = document.createElement("button");
        textDiv.appendChild(button);
        button.innerHTML = b.name;
        button.onmousedown = e => {
            if ([0, 1].includes(e.button)) {
                window.open(b.url);
            }
        };
    });
}

function createAllAdblockerCardsFromJson(data) {
    var json = JSON.parse(data);
    for (adblocker of json) {
        createAdblockerCard(adblocker);
    }
}

function updateLatestUpdateDate(data) {
    var parsed = JSON.parse(data);
    var windows = parsed["windows_version"];
    var macos = parsed["mac_version"];
    var windows_date = parsed["windows_date"] + " UTC";
    var macos_date = parsed["mac_date"] + " UTC";
    windows_date = new Date(Date.parse(windows_date)).toLocaleString();
    macos_date = new Date(Date.parse(macos_date)).toLocaleString();
    el("latestWinVer").innerHTML = windows;
    el("latestMacVer").innerHTML = macos;
    el("latestWinVerDate").innerHTML = windows_date;
    el("latestMacVerDate").innerHTML = macos_date;
}

[
    [EXPLOIT_DATA_URL, createAllCardsFromJson],
    [MALWARE_DATA_URL, createAllMalwareCardsFromJson],
    [BYPASSERS_DATA_URL, createAllBypasserCardsFromJson],
    [ADBLOCKERS_DATA_URL, createAllAdblockerCardsFromJson],
    [ISSUE_DATA_URL, createAllIssueCardsFromJson],
    [UPDATE_DATA_URL, updateLatestUpdateDate]
].forEach(i => {
    fetch(i[0]).then(d => d.text()).then(i[1]);
});


var importContainer = el("importContainer"); // tried compacting these two like most things in this code - man, javascript is WEIRD.
importContainer.addEventListener("click", e => {
    if (e.target != importContainer) {
        return;
    }
    importContainer.style.display = "none";
});

var exportContainer = el("exportContainer");
exportContainer.addEventListener("click", e => {
    if (e.target != exportContainer) {
        return;
    }
    exportContainer.style.display = "none";
});
