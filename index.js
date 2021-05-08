"use strict";

function getpettype(event, petid) {
    event.preventDefault();
    ajxpgn(`pettypediv_${petid}`, `services.php?cmd=getpettype&petid=${petid}`, 1);
}

function deletepet(event, petid, gskey) {
    event.preventDefault();
    
    if (!confirm("Delete this pet?")) {
        return;
    }

    ajxpgn('petslist',`services.php?cmd=deletepet&petid=${petid}`, 0, 0, null, null, null, null, gskey);	
}

function addpet(event) {
    event.preventDefault();

    const petname = encodeHTML(gid('petname').value);
    const pettype = encodeHTML(gid('pettype').value);
    
    if (petname === ''|| pettype === '') {
        return;
    }
    
    ajxpgn('petslist', `services.php?cmd=addpet&petname=${petname}&pettype=${pettype}`);
}