// const cookieParser = require('cookie-parser')
var express = require('express')
var router = express.Router()


router.post('/signin', async (req,res)=>{
    var username = req.body.userName
    var password = req.body.password
    var found = false
    console.log(username)
    console.log(password)
    var col1 = req.db.get('userList')
    var col2 = req.db.get('noteList')
    var userDetails = {"name":"", "icon":"", "notesArray":[]}
    

    await col1.find({name:username}).then((result)=>{
        // console.log(result)
        if (result.length!=0 && result[0]["password"]==password) {
            found = true
            req.session.userId = result[0]["_id"];
            userDetails["name"] = result[0]["name"]
            userDetails["icon"] = result[0]["icon"]
            // console.log(userDetails)
        }
        else{
            res.send("Login Failure")
        }
    }).catch((err)=>{
        res.send(err)
    })
    if (found) {
            // var id="63a09d123ff41983e17bf94d"
            var id = req.session.userId.toString()
            // console.log("id: "+ id)
            // console.log(typeof(id))
            await col2.find({userId:id}).then((docs)=>{
            // console.log(docs.length)
            // console.log(docs)
            for (x of docs) {
                var userNotes = {"_id":"", "lastsavedtime":"", "title":""}
                userNotes["_id"] = x["_id"]
                userNotes["lastsavedtime"] = x["lastsavedtime"]
                userNotes["title"] = x["title"]
                userDetails["notesArray"].push(userNotes)
            }
            console.log(userDetails);
            res.json(userDetails);
        }).catch((err)=>{
            res.send(err)
        })
    }
})

router.get('/logout', (req, res)=>{
    req.session.userId = null;
    res.send("")
})

router.get('/getnote', (req, res)=>{
    var col3 = req.db.get('noteList');
    var noteid = req.query.noteid;
    console.log(noteid)
    var noteDetails = {"_id":"", "lastsavedtime":"", "title":"", "content":""};
    
    col3.find({_id:noteid}).then((docs)=>{
        console.log(docs)
        if(docs.length!=0) {
            noteDetails["_id"] = docs[0]["_id"];
            noteDetails["lastsavedtime"] = docs[0]["lastsavedtime"];
            noteDetails["title"] = docs[0]["title"]
            noteDetails["content"] = docs[0]["content"]
            console.log(noteDetails)
            res.json(noteDetails);
        }
    }).catch((err)=>{
        res.send(err)
    })
    
})

function getServerTime() {
    let timeStamp = Date.now();
    let date_ob = new Date(timeStamp);
    let date = date_ob.toDateString();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();
    var lastsavedtime = hours+":"+minutes+":"+seconds+" "+date
    //20:12:10 Tue Nov 15 2022

    return(lastsavedtime)
}

router.post('/addnote', async(req, res)=>{
    var noteTitle = req.body.title;
    var noteContent = req.body.content;
    var userId = req.session.userId
    var col4 = req.db.get('noteList');
    var inserted = false

    var lastsavedtime = getServerTime();
    
    await col4.insert({"userId":userId, "lastsavedtime":lastsavedtime, "title":noteTitle, "content":noteContent}).then((WriteResult)=>{
        if (WriteResult.nInserted>0) {
            inserted = true
        }
    }).catch((err)=>{
        res.send(err)
    })
    if (inserted) {
        col4.find({}, {sort:{"_id":-1}}).limit(1).then((result)=>{
            if (result.length>0){
                let data = {"lastsavedtime":"", "noteId":""}
                data["lastsavedtime"] = result[0]["lastsavedtime"]
                data["noteId"] = result[0]["_id"]
                res.json(data)
            }
        })
    }    
})

router.put('/savenote/:noteid', (req, res)=>{
    col5 = req.db.get('noteList')
    noteContent = req.body.content
    noteTitle = req.body.title
    noteId = req.params.noteid
    lastsavedtime = getServerTime()

    col5.update({_id:noteId}, {$set:{content:noteContent, title:noteTitle, lastsavedtime:lastsavedtime}}).then(()=>{
        res.send(lastsavedtime)
    }).catch((err)=>{
        res.send(err)
    })
})

router.get('/searchnotes', (req, res)=> {
    var searchString = req.query.searchstr;
    var col6 = req.db.get('noteList');
    var data = {"noteId":"", "lastsavedtime":"", "title":""}

    col6.find({userId:req.session.userId}).then(async (docs)=>{
        var results = await docs.filter(obj => {
          return obj.title.includes(searchString) || obj.content.includes(searchString)
        })
        for (x of results) {
            data["noteId"] = x["_id"]
            data["lastsavedtime"] = x["lastsavedtime"] 
            data["title"] = x["title"]
        }
        res.json(data)
    }).catch((err)=>{
        res.send(err)
    })
})

router.delete('deletenote/:noteid', (req, res)=>{
    var col7 = req.db.get('noteList')

    col7.remove({_id:req.params.noteid}).then(()=>{
        res.send("");
    }).catch((err)=>{
        res.send(err)
    })
})










module.exports = router;