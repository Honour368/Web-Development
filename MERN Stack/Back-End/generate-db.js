var conn = new Mongo();
var db = conn.getDB("assignment2");

// db.userList.remove({});
db.noteList.remove({});

//insert into userlist
// db.userList.insert({'name': 'Andy', 'password': '123456', 'icon':'icons/andy.jpg'})
// db.userList.insert({'name': 'Honour', 'password': '654321', 'icon':'icons/icon2.jpg'})
// db.userList.insert({'name': 'Madina', 'password': '543210', 'icon':'icons/icon3.jpg'})


//Id gotten after inserting user details into userlist.
//Andy- "63a09d123ff41983e17bf94c"
//Honour - "63a09d123ff41983e17bf94d"
//Madina - "63a09d123ff41983e17bf94e"

//insert into notelist
db.noteList.insert({'userId': "63a09d123ff41983e17bf94c", 'lastsavedtime': '20:12:10 Tue Nov 15 2022', 'title': 'assignment 2', 'content': 'an iNotes app based on react'})
db.noteList.insert({'userId': "63a09d123ff41983e17bf94c", 'lastsavedtime': '18:18:15 Wed Nov 16 2022', 'title': 'assignment 3', 'content': 'I love WWW'})
db.noteList.insert({'userId': "63a09d123ff41983e17bf94c", 'lastsavedtime': '17:45:10 Thu Nov 17 2022', 'title': 'assignment 4', 'content': 'I am a web designer'})

db.noteList.insert({'userId': "63a09d123ff41983e17bf94d", 'lastsavedtime': '20:12:10 Mon Nov 14 2022', 'title': 'Love', 'content': 'Love above all'})
db.noteList.insert({'userId': "63a09d123ff41983e17bf94d", 'lastsavedtime': '20:12:10 Mon Nov 14 2022', 'title': 'Peace', 'content': 'Must find peace!'})

db.noteList.insert({'userId': "63a09d123ff41983e17bf94e", 'lastsavedtime': '20:12:10 Tue Nov 1 2022', 'title': 'Football', 'content': 'This world cup is amazing'})
db.noteList.insert({'userId': "63a09d123ff41983e17bf94e", 'lastsavedtime': '20:12:10 Tue Nov 15 2022', 'title': 'Football 2', 'content': 'I want messi to win the world cup'})



// db.userList.find().toArray((result)=>{
//     var id="";
//     for (x of result) {
//         if (x['name']=="Andy") {
//             console.log(x['name']);
//             id = x['_id'];
//             //Andy
           
//         }
//         else if (x['name']=="Honour") {
//             console.log(x['name']);
//             id = x['_id'];
//             //Honour
//             db.noteList.insert({'userId': id, 'lastsavedtime': '20:12:10 Mon Nov 14 2022', 'title': 'Love', 'content': 'Love above all'})
//             db.noteList.insert({'userId': id, 'lastsavedtime': '20:12:10 Mon Nov 14 2022', 'title': 'Peace', 'content': 'Must find peace!'})
//         }
//         else if (x['name']=="Madina") {
//             console.log(x['name']);
//             id = x['_id'];
//             //Madina
//             db.noteList.insert({'userId': id, 'lastsavedtime': '20:12:10 Tue Nov 1 2022', 'title': 'Football', 'content': 'This world cup is amazing'})
//             db.noteList.insert({'userId': id, 'lastsavedtime': '20:12:10 Tue Nov 15 2022', 'title': 'Football 2', 'content': 'I want messi to win the world cup'})
//         }
//         else{
//             //do nothing
//         }
//     }

// })






