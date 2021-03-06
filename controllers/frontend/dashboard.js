global.fetch = require("node-fetch");
const jwt = require('jsonwebtoken');




exports.dashboardPage = (req, res) => { res.render("pages/myaccount/admin/dashboard");}

exports.userPage = async (req, res) => { 
    try {
        let url = `http://localhost:3000/api/user/`;

        let userInfo = await fetch(url);
        userInfo = await userInfo.json();

        res.render('pages/myaccount/admin/user', {userInfo})
    } catch {
        res.status(401).json({error: 'Failed Request'});
    }
}

exports.partnerPage = async (req, res) => { 
    let url;
    if (req.query) {
        let urlStringFilter = "?";
        for (let property in req.query) {
            urlStringFilter += `${property}=${req.query[property]}&`
        }
        urlStringFilter = urlStringFilter.slice(0, urlStringFilter.length-1)
        url = `http://localhost:3000/api/partner${urlStringFilter}`;
    
    }
    
    try {
        let urlSelect = `http://localhost:3000/api/partner`;

        let partnerInfoForSelect = await fetch(urlSelect);
        partnerInfoForSelect = await partnerInfoForSelect.json();

        let partnerInfo = await fetch(url);
        partnerInfo = await partnerInfo.json();
        
        partnerInfo.forEach(info => {
            if(info.image != "noImage") {
                info.image = JSON.parse(info.image);
            }
        })

        let foodType = Array.from(new Set(partnerInfoForSelect.map(element => element.foodType))).sort();
        let chain = Array.from(new Set(partnerInfoForSelect.map(element => element.chain))).sort();
        let postcode = Array.from(new Set(partnerInfoForSelect.map(element => element.address.postcode))).sort();
        let city = Array.from(new Set(partnerInfoForSelect.map(element => element.address.city))).sort();

        let urlContainer = `http://localhost:3000/api/container/`;

        let containerInfo = await fetch(urlContainer);
        containerInfo = await containerInfo.json();
       
        let material = Array.from(new Set(containerInfo.map(element => element.material))).sort();
        
        let selectInfo = {
            foodType: foodType,
            chain: chain,
            postcode: postcode,
            city: city,
            material: material
        };



        res.render('pages/myaccount/admin/partner', { selectInfo, containerInfo, partnerInfo})
    } catch {
        res.status(401).json({error: 'Failed Request'});
    }
}

exports.containerPage = async (req, res) => { 
    try {
        let url = `http://localhost:3000/api/container/`;

        let containerInfo = await fetch(url);
        containerInfo = await containerInfo.json();

        res.render('pages/myaccount/admin/container', {containerInfo})
    } catch {
        res.status(401).json({error: 'Failed Request'});
    }
}

exports.historyPage = async (req, res) => { 
    try {
        let url = `http://localhost:3000/api/history/`;

        let historyInfo = await fetch(url);
        historyInfo = await historyInfo.json();

        res.render('pages/myaccount/admin/history', {historyInfo})
    } catch {
        res.status(401).json({error: 'Failed Request'});
    }
}