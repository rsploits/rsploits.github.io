
var EXPLOIT_DATA_URL = "https://raw.githubusercontent.com/davidsaltacc/exploits-data/main/exploits.json";
var MALWARE_DATA_URL = "https://raw.githubusercontent.com/davidsaltacc/exploits-data/main/viruses-rats-fakes.json";
var BYPASSERS_DATA_URL = "https://raw.githubusercontent.com/davidsaltacc/exploits-data/main/bypassers.json";
var ADBLOCKERS_DATA_URL = "https://raw.githubusercontent.com/davidsaltacc/exploits-data/main/adblockers.json";
var ISSUE_DATA_URL = "https://api.github.com/repos/rsploits/rsploits.github.io/issues";

var el = x => document.getElementById(x);

function changeTab(name, button) { // very messy but works
    el("exploits").style.display = "none";
    el("viruses").style.display = "none";
    el("bypassers").style.display = "none";
    el("adblockers").style.display = "none";
    el("credits").style.display = "none";
    //el("editor").style.display = "none";
    el("issues").style.display = "none";
    el(name).style.display = "flex";
    el("nav_exploits_button").className = "";
    el("nav_viruses_button").className = "";
    el("nav_bypassers_button").className = "";
    el("nav_adblockers_button").className = "";
    el("nav_credits_button").className = "";
    //el("nav_editor_button").className = "";
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

    //TODO remove later
    if (title == "Celery v2") { cardDiv.classList.add("ex_keyless", "ex_free"); }

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
    button.onclick = () => window.open(buttonUrl);

}

function createAllCardsFromJson(data) {
    var json = JSON.parse(data);
    for (card of json) {
        createCard(card);
    }
}


function createEditableCard() {

}

function createAllEditableCardsFromJson(data) {
    // CLEAR ALL EXISTING EDITABLE CARDS
    var json = JSON.parse(data);
    for (card of json) {
        createEditableCard(card);
    }
}

function autoImportEditableCards() {
    fetch(EXPLOIT_DATA_URL).then(data => data.text()).then(createAllEditableCardsFromJson);
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
    span.onclick = () => window.open(url);

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
        button.onclick = () => window.open(b.url);
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
        button.onclick = () => window.open(b.url);
    });
}

function createAllAdblockerCardsFromJson(data) {
    var json = JSON.parse(data);
    for (adblocker of json) {
        createAdblockerCard(adblocker);
    }
}

[
    [EXPLOIT_DATA_URL, createAllCardsFromJson],
    [MALWARE_DATA_URL, createAllMalwareCardsFromJson],
    [BYPASSERS_DATA_URL, createAllBypasserCardsFromJson],
    [ADBLOCKERS_DATA_URL, createAllAdblockerCardsFromJson],
    [ISSUE_DATA_URL, createAllIssueCardsFromJson]
].forEach(i => {
    fetch(i[0]).then(d => d.text()).then(i[1]);
});