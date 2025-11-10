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

// containers to contain stuff
// or something i dont know
// i am so glad this isnt my
// AP® Computer Science Principles
// Performance Task!!!!!!
let deadnames = []
let preferred = {}
let currentOptions = {}

let replacePronouns = []
let preferredPronouns = []

// escape user-provided strings so they are safe to use in regexp
function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// preserve capitalization of names/nouns (e.g He -> She)
function matchCase(replacement, matched) {
    if (!matched) return replacement;
    if (matched.toUpperCase() === matched) return replacement.toUpperCase();
    if (matched[0] && matched[0].toUpperCase() === matched[0]) return replacement.charAt(0).toUpperCase() + replacement.slice(1);
    return replacement.toLowerCase();
}

// simple check so that you can type and stuff
function isInFormElement(node) {
    let formRelatedElements = ["FORM", "INPUT", "TEXTAREA"];
    let current = node.parentElement;

    while (current) {
        if (formRelatedElements.includes(current.tagName)) {
            return true;
        }

        current = current.parentElement;
    }

    return false;
}

// gets all data and fills it into the containers, or warns user
// that deadnameify isnt set up.
browser.storage.sync.get("deadnames").then((names) => {
    if (names === null || names.deadnames === null) {
        alert("Please set up Deadnameify!")
    } else {
        deadnames = names.deadnames  
    }
})

browser.storage.sync.get("preferred").then((names) => {
    if (names === null || names.preferred === null) {
        alert("Please set up Deadnameify!")
    } else {
        preferred = names.preferred
    }
})

browser.storage.sync.get("advanced").then((data) => {
    if (data === null || data.advanced === null || data.advanced.options === null) {
        alert("Please set up Deadnameify!")
    } else {
        currentOptions = data.advanced.options
    }
})

browser.storage.sync.get("aggressive").then((data) => {
    if (data === null || data.aggressive === null || data.aggressive.pronouns === null || data.aggressive.pronouns === null) {
        alert("Please set up Deadnameify!")
    } else {
        let tempContainer = data.aggressive.pronouns.split("/")
        
        tempContainer.forEach((element) => {
            replacePronouns.push(element.split(","))
        })

        preferredPronouns = data.aggressive.preferred.split(",")
    }
})

// loops this as text can change dynamically.
setInterval(() => {
    // get all text nodes inside of the document
    function getTextNodes(node) {
        let textNodes = []
        if (node.nodeType === Node.TEXT_NODE) {
            textNodes.push(node)
        } else {
            for (let child of node.childNodes) {
                textNodes = textNodes.concat(getTextNodes(child))
            }
        }
        return textNodes;
    }

    // WOW!!!
    let textNodes = getTextNodes(document.body);

    // replace all textnode's text
    textNodes.forEach(node => {
        // if textnode not in form element
        if (!isInFormElement(node)) {
            // for each deadname
            deadnames.forEach(deadname => {
                // if is case sensitive, use regex i flag, else, use only g.
                let caseRegex = deadname.isCaseSensitive ? "g" : "ig"

                let firstRegex = new RegExp(deadname.firstName, caseRegex)
                let middleRegex = new RegExp(deadname.middleName, caseRegex)
                let lastRegex = new RegExp(deadname.lastName, caseRegex)

                // only applies to aggressive mode

                // what the text do tho
                let originalText = node.textContent

                let hasFirstName = originalText.matchAll(firstRegex).length !== 0
                let hasMiddleName = originalText.matchAll(middleRegex).length !== 0
                let hasLastName = originalText.matchAll(lastRegex).length !== 0

                let newText = originalText

                // might need to implement an aggressive mode.
                if (currentOptions.aggressiveMode) {
                    newText = newText.replace(firstRegex, preferred.firstName).replace(middleRegex, preferred.middleName).replace(lastRegex, preferred.lastName)
                } else {
                    // for some people, they use a middle name for their last name on websites
                    if (hasFirstName && hasMiddleName && !hasLastName) {
                        // THIS DEPENDS ON A CHECK
                        if (preferred.lastName !== null && preferred.lastName !== "") {
                            newText = newText.replace(firstRegex, preferred.firstName).replace(middleRegex, preferred.middleName + " " + preferred.lastName)
                        } else {
                            newText = newText.replace(firstRegex, preferred.firstName).replace(middleRegex, preferred.middleName)
                        }
                    }

                    // in other instances, some people use only firstname lastname.
                    else if (hasFirstName && !hasMiddleName && hasLastName) {
                        if (preferred.middleName !== null && preferred.middleName !== "") {
                            newText = newText.replace(firstRegex, preferred.firstName).replace(lastRegex, preferred.middleName + " " + preferred.lastName)
                        } else {
                            newText = newText.replace(firstRegex, preferred.firstName).replace(lastRegex, preferred.lastName)
                        }
                    }

                    // this is assuming the usage of a full name
                    else if (hasFirstName && hasMiddleName && hasLastName) {
                        newText.replace(firstRegex, preferred.firstName).replace(middleRegex, preferred.middleName).replace(lastRegex, preferred.lastName)
                    }
                }
                
                // yayyy
                node.textContent = newText
            })
            
            if (currentOptions.aggressiveMode) {
                let subjectPreferred = preferredPronouns[0]
                let objectivePreferred = preferredPronouns[1]
                let possesivePreferred = preferredPronouns[2]
                let reflexivePreferred = preferredPronouns[3]

                // Use word boundaries so short pronouns (e.g. "he") don't match inside other words (e.g. "she", "the").
                // Use case-insensitive flag and a replacer to preserve capitalization from the original match.
                replacePronouns.forEach((pronounSet) => {
                    let subjectPattern = "\\b" + escapeRegExp(pronounSet[0]) + "\\b"
                    let objectivePattern = "\\b" + escapeRegExp(pronounSet[1]) + "\\b"
                    let possesivePattern = "\\b" + escapeRegExp(pronounSet[2]) + "\\b"
                    let reflexivePattern = "\\b" + escapeRegExp(pronounSet[3]) + "\\b"

                    let subject = new RegExp(subjectPattern, "gi")
                    let objective = new RegExp(objectivePattern, "gi")
                    let possesive = new RegExp(possesivePattern, "gi")
                    let reflexive = new RegExp(reflexivePattern, "gi")

                    let originalText = node.textContent
                    let newText = originalText

                    newText = newText.replace(subject, (m) => matchCase(subjectPreferred, m))
                        .replace(objective, (m) => matchCase(objectivePreferred, m))
                        .replace(possesive, (m) => matchCase(possesivePreferred, m))
                        .replace(reflexive, (m) => matchCase(reflexivePreferred, m))

                    node.textContent = newText
                })
            }   
        };
    })
}, 32);