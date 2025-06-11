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
var deadnames = []
var preferred = {}

// simple check so that you can type and stuff
function isInFormElement(node) {
    const formRelatedElements = ["FORM", "INPUT", "TEXTAREA"];
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
browser.storage.sync.get("deadnames").then((value) => {
    browser.storage.sync.get("preferred").then((prefValue) => {
        if (value == null || prefValue == null || value.deadnames == null) {
            alert("Please set up Deadnameify!")
        } else {
            console.log(value.deadnames, prefValue.preferred)
            deadnames = value.deadnames
            preferred = prefValue.preferred
        }
    })
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
    const textNodes = getTextNodes(document.body);

    // replace all textnode's text
    textNodes.forEach(node => {
        // if textnode not in form element
        if (!isInFormElement(node)) {
            // for each deadname
            deadnames.forEach(deadname => {
                // if is case sensitive, use regex i flag, else, use only g.
                var caseRegex = deadname.isCaseSensitive ? "g" : "ig"

                // what the text do tho
                const originalText = node.textContent

                // replace text with preferred name
                const newText = originalText
                    .replace(new RegExp(deadname.firstName, caseRegex), preferred.firstName)
                    .replace(new RegExp(deadname.middleName, caseRegex), preferred.middleName)
                    .replace(new RegExp(deadname.lastName, caseRegex), preferred.lastName)

                // yayyy
                node.textContent = newText
            })
        };
    })
}, 32);