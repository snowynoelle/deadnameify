/*
    Deadnameify - Deadname Remover
    Copyright (C) Noelle Snow, 2025

    This file is part of Deadnameify.
    Deadnameify is free software: you can redistribute it and/or modify it under 
    the terms of the GNU General Public License as published by the Free Software Foundation, 
    either version 1 of the License, or (at your option) any later version.

    Deadnameify is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; 
    without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
    See the GNU General Public License for more details.
    
    You should have received a copy of the GNU General Public License 
    along with Deadnameify. If not, see <https://www.gnu.org/licenses/>.
*/

// welcome to the mess of a code this is
// good luck and have fun
var deadnameCount = 1;

function createDeadnameElem(firstNameString = null, middleNameString = null, lastNameString = null, isCaseSensitiveToggle = null, shouldHaveBTN2 = false) {
    if (typeof(firstNameString) != "string") {
        firstNameString = null;
    }
    // div to contain everything type sh-
    var div = document.createElement('div');
    div.classList.add("nameContainer");

    // wow!!!!!!
    var btn = document.createElement("button");
    btn.classList.add("minimize");
    btn.textContent = `(Deadname ${deadnameCount}) Maximize!!!`;
    btn.onclick = toggleMinMax;

    // divs in div!!!!!
    var nameDiv = document.createElement("div");
    nameDiv.classList.add("minimizeContent");
    nameDiv.classList.add("nameForm")

    // could have been a one liner but whatever im too lazy
    // its 12am and i want to sleep i am a eepy girl,,,
    if (shouldHaveBTN2 == true) {
        var btn2 = document.createElement("button");
        btn2.classList.add("removeDeadname");
        btn2.textContent = `Remove deadname`;
        btn2.onclick = removeDeadname;
    } else {
        var btn2 = document.createElement("a")
    }

    // name thingy
    var firstName = document.createElement("input");
    firstName.classList.add("name");
    firstName.classList.add("first");
    firstName.type = "text";
    firstName.placeholder = "First Name";

    var middleName = document.createElement("input");
    middleName.classList.add("name");
    firstName.classList.add("middle");
    middleName.type = "text";
    middleName.placeholder = "Middle Name(s)";

    var lastName = document.createElement("input");
    lastName.classList.add("name");
    firstName.classList.add("last");
    lastName.type = "text";
    lastName.placeholder = "Last Name";

    // WOW!!!
    var lineBreak = document.createElement("br");

    // case sensitive button
    var isCaseSensitive = document.createElement("label");
    isCaseSensitive.innerText = "\nCase Sensitive? ";

    var isCaseSensitiveRadius = document.createElement("input");
    isCaseSensitiveRadius.classList.add("case");
    isCaseSensitiveRadius.type = "checkbox";

    // defining values if specified
    if (firstNameString != null) {
        firstName.value = firstNameString;
    }

    if (middleNameString != null) {
        middleName.value = middleNameString;
    }

    if (lastNameString != null) {
        lastName.value = lastNameString;
    }

    if (isCaseSensitiveToggle != null) {
        isCaseSensitiveRadius.checked = isCaseSensitiveToggle;
    }

    // it do be case sensitive tho
    isCaseSensitive.appendChild(isCaseSensitiveRadius);

    // appending these in order so that nothing hopefully breaks
    // if something breaks im going to throw a rock at someone!
    nameDiv.appendChild(firstName);
    nameDiv.appendChild(middleName);
    nameDiv.appendChild(lastName);
    nameDiv.appendChild(lineBreak);
    nameDiv.appendChild(isCaseSensitive);
    nameDiv.appendChild(lineBreak);
    nameDiv.appendChild(btn2);

    // wow so cool
    div.appendChild(btn)
    div.appendChild(nameDiv);

    return div
}

// this is like peak boilerplate
function createNewNameElement(firstNameString = null, middleNameString = null, lastNameString = null, isCaseSensitiveToggle = null, shouldHaveBTN2 = true) {
    // ok
    var deadnames = document.getElementById("deadnames")

    // WHY NOT JUST CONTAIN THE FREAKING CODE THERE???
    var elem = createDeadnameElem(firstNameString, middleNameString, lastNameString, isCaseSensitiveToggle, shouldHaveBTN2)

    // DUDEEEEEE
    deadnames.appendChild(elem)
    deadnameCount++;
}

// bro i wish it was this easy irl
function removeDeadname() {
    // yap yap yap just let me use event
    var childElement = event.originalTarget;

    // the parent of the parent of the parent of the...
    var parentElement = childElement.parentElement.parentElement;

    // :3
    parentElement.remove();

    deadnameCount--;
}

function getAllNameData() {
    var nameContainers = document.getElementsByClassName("nameForm")
    var deadnames = []

    // for all nameforms
    for (let i = 0; i < nameContainers.length; i++) {
        // harvest their children /j
        var children = nameContainers[i].children

        // get first middle and last names as they are in order
        var firstName = children[0].value
        var middleName = children[1].value
        var lastName = children[2].value

        // this element is messed up.
        // im not gonna fix it.
        var isCaseSensitive = children[3].children[1].checked

        // push it all to an array that we're gonna save
        // later on, lol
        deadnames.push({
            firstName: firstName,
            middleName: middleName,
            lastName: lastName,
            isCaseSensitive: isCaseSensitive
        })
    }

    // if this element dosent exist i will blow up.
    var prefName = document.getElementsByClassName("prefNameForm")[0].children
    
    let aggressiveToggle = document.getElementById("aggressive").checked
    let aggressivePronouns = document.getElementById("aggressive_pronouns").value
    let aggressivePreferred = document.getElementById("aggressive_pref_pronouns").value
    
    // same thing as deadnames, just no case sensitive check
    // how the hell would a preferred name have a case sensitive
    // check like what???
    var preferred = {
        firstName: prefName[0].value,
        middleName: prefName[1].value,
        lastName: prefName[2].value
    }

    let advanced = {
        options: {
            aggressiveMode: aggressiveToggle
        }
    }

    let aggressive = {
        pronouns: aggressivePronouns,
        preferred: aggressivePreferred
    }

    // if you do not save i will combust into flames
    browser.storage.sync.set({
        deadnames: deadnames,
        preferred: preferred,
        advanced: advanced,
        aggressive: aggressive
    })
}

function dumbCheckboxTransition() {
    if (document.getElementById("aggressive").checked) {
        document.getElementById("aggressive_pronouns").disabled = false
        document.getElementById("aggressive_pref_pronouns").disabled = false
    } else {
        document.getElementById("aggressive_pronouns").disabled = true
        document.getElementById("aggressive_pref_pronouns").disabled = true
    }
}

function toggleMinMax() {
    // event is depricated, sure buddy..
    // i WILL use event and you WILL like it.
    var childElement = event.originalTarget;
    var parentElement = childElement.parentElement;

    // usually element 0 of minimizeContent is the element itself, if not, what the heck happened?
    var element = parentElement.getElementsByClassName("minimizeContent")[0]

    // using includes("Maximize") since edge case where display is set to none.
    // i know i can fix it using css. im too lazy tbh.
    if (element.style.display === "none" || childElement.innerText.includes("Maximize")) {
        element.style.display = "contents";
        childElement.innerText = childElement.innerText.replace("Maximize", "Minimize");
    } else {
        element.style.display = "none";
        childElement.innerText = childElement.innerText.replace("Minimize", "Maximize");
    }
}

var shouldContainRemoveButton = false;
let hasFinishedAdvanced = false
let hasFinishedAggressive = false;

// once all the content in the page is loaded
document.addEventListener('DOMContentLoaded', function () {
    browser.storage.sync.get("advanced").then((data) => {
        if (data != null && data.advanced != null && data.advanced.options != null) {
            document.getElementById("aggressive").checked = data.advanced.options.aggressiveMode
            hasFinishedAdvanced = true
        } else {
            hasFinishedAdvanced = true
        }
    })

    browser.storage.sync.get("aggressive").then((data) => {
        if (data != null && data.aggressive != null && data.aggressive.pronouns != null && data.aggressive.preferred != null) {
            document.getElementById("aggressive_pronouns").value = data.aggressive.pronouns
            document.getElementById("aggressive_pref_pronouns").value = data.aggressive.preferred
            hasFinishedAggressive = true
        } else {
            hasFinishedAggressive = true
        }
    })
    
    // load all the deadnames and the preffered name for the user
    browser.storage.sync.get("deadnames").then((value) => {
        browser.storage.sync.get("preferred").then((prefValue) => {
            // if values somehow dont exist, or for some reason just dont work?

            // does not include preffered names as some would rather not go by
            // a name, sooooo :3
            if (value === undefined || prefValue === undefined || value.deadnames === undefined) {
                createNewNameElement(null, null, null, null, false)
            } else {
                value.deadnames.forEach((val) => {
                    createNewNameElement(val.firstName, val.middleName, val.lastName, val.isCaseSensitive, shouldContainRemoveButton)
                    shouldContainRemoveButton = true;
                })
            }

            // set preferred name
            if (prefValue.preferred !== undefined) {
                document.getElementById("pref_first").value = prefValue.preferred.firstName;
                document.getElementById("pref_middle").value = prefValue.preferred.middleName;
                document.getElementById("pref_last").value = prefValue.preferred.lastName;
            }

            // for all minmax (minimize-maximize elements)
            var allMinMaxElements = document.getElementsByClassName("minimize")

            Array.from(allMinMaxElements).forEach(domElement => {
                // UNLESS if the element is a preferred name, assume that the user
                // wants to keep deadname private, so it minimizes it :3
                if (domElement.classList.contains("preferred")) {
                    var parentElement = domElement.parentElement
                    parentElement.getElementsByClassName("minimizeContent")[0].style.display = "contents";
                }

                // wow
                domElement.onclick = toggleMinMax;
            });

            // again, WOW!!
            var allPrefNames = document.getElementsByClassName("addMoreNames")
            allPrefNames[0].addEventListener("click", createNewNameElement);

            // scan for name data
            setInterval(() => {
                if (hasFinishedAggressive && hasFinishedAdvanced) {
                    getAllNameData()
                    dumbCheckboxTransition()
                }
            }, 100);
        });
    });
});