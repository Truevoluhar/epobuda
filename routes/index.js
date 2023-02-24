var express = require('express');
var userModel = require('../models/usermodel.js');
var JNModel = require('../models/pobudamodel.js');
var router = express.Router();
var helper = require('./functions.js');

const isAuth = (req, res, next) => {
  if (req.session.isAuth) {
    next()
  } else {
    return res.redirect('/login')
  }
}




/* GET home page. */
router.get('/', isAuth, async function(req, res, next) {
  let user = await userModel.find({ _id: req.session.user });
  let users = await userModel.find({});
  let jn = await JNModel.find({});
  res.render('index', { user: user[0].name, jn: jn, users: users, helper: helper });
});



// Login

router.get('/login', (req, res) => {
  res.render('login', { response: "" });
})

router.post('/login', async (req, res) => {
  const findUser = await userModel.find({ username: req.body.username });
  console.log(findUser);

  if (findUser.length < 1) {
    let noUser = "Uporabnik s tem uporabniškim imenom ne obstaja.";
    res.render('login', { response: noUser });
  } else {
    const pass1 = req.body.password;
    const pass2 = findUser[0].password;
    if (pass1 === pass2) {
      req.session.isAuth = true
      req.session.user = findUser[0]._id
      req.session.username = findUser[0].name
      res.redirect('/');
    } else {
      let noMatch = "Vnešeno geslo ni pravilno.";
      res.render('login', { response: noMatch })
    }
  }
})

// Logout 

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return console.log(err);
    res.redirect('/login');
  })
})



// Register

router.get('/register', (req, res) => {
  res.render('register', { response: "" });
})

router.post('/register', async (req, res) => {
  const ifExist = await userModel.find({ username: req.body.username });
  if (ifExist.length > 0) {
    let exist = "Uporabnik s tem uporabniškim imenom že obstaja";
    res.render('register', { response: exist });
  } else {
    if (req.body.password === req.body.password2) {
      let newUser = new userModel({
        username: req.body.username,
        password: req.body.password,
        name: req.body.name
      });
      newUser.save((err, data) => {
        if (err) throw err;
        console.log(data);
      })
      res.redirect('/login');
    } else {
      let noMatch = "Vnešeni gesli se ne ujemata.";
      res.render('register', { response: noMatch });
    }
  }
})

module.exports = router;




// Ustvari

router.get('/ustvari', isAuth, async (req, res) => {
  let users = await userModel.find({});
  res.render('ustvari', { response: "", user: req.session.username, users: users });
})

router.post('/ustvari', isAuth, async (req, res) => {
  let checker = await JNModel.find({ stpobude: req.body.stpobude });
  if (checker.length > 0) {
    let response = "Številka pobude že obstaja. Kreiranje neuspešno."
    res.render('ustvari', { response: response });
  } else {
    let d = req.body;
    let novoJN = new JNModel({
      datum: d.datum,
      stpobude: d.stpobude,
      predmet: d.predmet,
      predlagatelj: d.predlagatelj,
      izvajalec: d.izvajalec,
      narocilnicapogodba: d.narocilnicapogodba,
      stnarocilnicepogodbe: d.stnarocilnicepogodbe,
      pp: d.pp,
      nrp: d.nrp,
      konto: d.konto,
      podkonto: d.podkonto,
      skupnavrednost: d.skupnavrednost,
      l2022: d.l2022,
      l2023: d.l2023,
      l2024: d.l2024,
      l2025: d.l2025,
      l2026: d.l2026,
      l2027: d.l2027,
      l2028: d.l2028,
      stzadevevzbirki: d.stzadevevzbirki,
      statuszadeve: d.statuszadeve,
      zadnjaspremembastatusa: d.zadnjaspremembastatusa
    });
    novoJN.save((err, data) => {
      if (err) throw err;
      console.log(data);
      res.redirect('/');
    })
  }
})



// Pogled

router.get("/item/:id", isAuth, async (req, res) => {
  const item = await JNModel.findById(req.params.id);
  res.render('single', { item: item, user: req.session.username });
})


// Uredi

router.get('/edit/:id', isAuth, async (req, res) => {
  const users = await userModel.find({});
  let item = await JNModel.findById(req.params.id);
  res.render('edit', { item: item, user: req.session.username, users: users });
})

router.post('/edit/:id', isAuth, async (req, res) => {
  let d = req.body
  const x = await JNModel.findByIdAndUpdate(req.params.id, {
    datum: d.datum,
    stpobude: d.stpobude,
    predmet: d.predmet,
    predlagatelj: d.predlagatelj,
    izvajalec: d.izvajalec,
    narocilnicapogodba: d.narocilnicapogodba,
    stnarocilnicepogodbe: d.stnarocilnicepogodbe,
    pp: d.pp,
    nrp: d.nrp,
    konto: d.konto,
    podkonto: d.podkonto,
    skupnavrednost: d.skupnavrednost,
    l2022: d.l2022,
    l2023: d.l2023,
    l2024: d.l2024,
    l2025: d.l2025,
    l2026: d.l2026,
    l2027: d.l2027,
    l2028: d.l2028,
    stzadevevzbirki: d.stzadevevzbirki,
    statuszadeve: d.statuszadeve,
    zadnjaspremembastatusa: d.zadnjaspremembastatusa
  });
  res.redirect('/');
})


// Izbriši

router.post('/delete/:id', isAuth, async (req, res) => {
  await JNModel.findByIdAndDelete(req.params.id);
  res.redirect('/');
})



// Iskalnik

router.post('/search', isAuth, async (req, res) => {
  let users = await userModel.find({});
  let user = await userModel.find({ _id: req.session.user })
  let search = req.body.searchinput.toLowerCase();
  console.log(search);
  let result = []
  let data = await JNModel.find({});
  for (let i = 0; i < data.length; i++) {
    let predmet = data[i].predmet.toLowerCase();
    if (predmet.includes(search)) {
      result.push(data[i]);
    }
  }
  res.render('index', { user: user[0].name, jn: result, users: users, helper: helper });
})


//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MOJE ZADEVE ///////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get('/mojezadeve', isAuth, async (req, res) => {
  let users = await userModel.find({});
  let user = await userModel.find({ _id: req.session.user });
  let data = await JNModel.find({});
  let result = [];
  for (let i = 0; i < data.length; i++) {
    let mz = data[i].izvajalec;
    if (mz === req.session.username) {
      result.push(data[i]);
    }
  }
  res.render('userindex', { user: user[0].name, users: users, jn: result, helper: helper });
})





//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// FILTRI ////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Status

router.post('/filter/status', isAuth, async (req, res) => {
  let users = await userModel.find({});
  let user = await userModel.find({ _id: req.session.user });
  let data = await JNModel.find({});
  let input = req.body.statuszadeve;
  let result = [];
  for (let i = 0; i < data.length; i++) {
    let status = data[i].statuszadeve;
    if (input === status) {
      result.push(data[i]);
    }
  }
  res.render('index', { user: user[0].name, jn: result, users: users, helper: helper });
})

// Izvajalci

router.post('/filter/izvajalci', isAuth, async (req, res) => {
  let users = await userModel.find({});
  let user = await userModel.find({ _id: req.session.user });
  let data = await JNModel.find({});
  let input = req.body.izvajalec;
  let result = [];
  for (let i = 0; i < data.length; i++) {
    let izvajalec = data[i].izvajalec;
    if (input === izvajalec) {
      result.push(data[i]);
    }
  }
  res.render('index', { user: user[0].name, jn: result, users: users, helper: helper });
})

// Naročilnica / pogodba

router.post('/filter/narocilnicapogodba', isAuth, async (req, res) => {
  let users = await userModel.find({});
  let user = await userModel.find({ _id: req.session.user });
  let data = await JNModel.find({});
  let input = req.body.narocilnicapogodba;
  let result = [];
  for (let i = 0; i < data.length; i++) {
    let narocilnicapogodba = data[i].narocilnicapogodba;
    if (input === narocilnicapogodba) {
      result.push(data[i]);
    }
  }
  res.render('index', { user: user[0].name, jn: result, users: users, helper: helper });
})





//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Sortiranje ////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

function ab(a, b) {
  return a - b;
}


router.post('/sort/predmet', async (req, res) => {
  let users = await userModel.find({});
  let user = await userModel.find({ _id: req.session.user });
  let data = await JNModel.find({});
  let sorter = req.body.sorter;
  if (sorter === "a-z") {
    data.sort();
  } else if (sorter === "z-a") {
    data.sort();
    data.reverse();
  }
  res.render('index', { user: user[0].name, jn: data, users: users, helper: helper });
})

router.post('/sort/datum', isAuth, async (req, res) => {
  let sort = req.body.datumsort;
  let users = await userModel.find({});
  let user = await userModel.find({ _id: req.session.user });
  let data = await JNModel.find({});
  let newArr = [];
  let dateArr = [];
  for (let i = 0; i < data.length; i++) {
    let date = new Date(data[i].datum);
    dateArr.push(date);
    if (sort === "Novejše") {
      dateArr.sort((a, b) => a - b)
    } else if (sort === "Starejše") {
      dateArr.sort((a, b) => b - a);
    }
  }
  for (let i = 0; i < dateArr.length; i++) {
    let string = dateArr[i].toString();
    let slice = string.slice(4, 15);
    let sliceArr = slice.split(" ");
    let sortedArr = [];
    sortedArr.push(sliceArr[1]);
    sortedArr.push(sliceArr[0]);
    sortedArr.push(sliceArr[2]);
    if (sortedArr[1] === "Jan") {
      sortedArr[1] = "01"
    } else if (sortedArr[1] === "Feb") {
      sortedArr[1] = "02"
    } else if (sortedArr[1] === "Mar") {
      sortedArr[1] = "03"
    } else if (sortedArr[1] === "Apr") {
      sortedArr[1] = "04"
    } else if (sortedArr[1] === "May") {
      sortedArr[1] = "05"
    } else if (sortedArr[1] === "Jun") {
      sortedArr[1] = "06"
    } else if (sortedArr[1] === "Jul") {
      sortedArr[1] = "07"
    } else if (sortedArr[1] === "Aug") {
      sortedArr[1] = "08"
    } else if (sortedArr[1] === "Sep") {
      sortedArr[1] = "09"
    } else if (sortedArr[1] === "Oct") {
      sortedArr[1] = "10"
    } else if (sortedArr[1] === "Nov") {
      sortedArr[1] = "11"
    } else if (sortedArr[1] === "Dec") {
      sortedArr[1] = "12"
    }
    let newStr = sortedArr.reverse().join("-");
    console.log(newStr);
    for (let j = 0; j < data.length; j++) {
      if (newStr === data[j].datum) {
        data[j].datum = data[j].datum.split("-").reverse().join(". ");
        newArr.push(data[j]);
      }
    }
  }
  res.render('index', {
    user: user[0].name,
    jn: newArr,
    users: users,
    helper: helper
  })
});


router.post('/sort/value', isAuth, async (req, res) => {
  let users = await userModel.find({});
  let user = await userModel.find({ _id: req.session.user });
  let data = await JNModel.find({});
  let sorter = req.body.sorter;
  let num = []
  let newArr = []
  for (let i = 0; i < data.length; i++) {
    num.push(data[i].skupnavrednost);
    if (sorter === "Naraščajoče") {
      num.sort((a,b) => a - b);
    } else if (sorter === "Padajoče") {
      num.sort((a,b) => b - a);
    }
  }
  console.log(num);
  for (let i = 0; i < num.length; i++) {
    for (let j = 0; j < data.length; j++) {
      if (num[i] === data[j].skupnavrednost) {
        newArr.push(data[j]);
      }
    }
  }
  console.log(newArr);
  res.render('index', {
    user: user[0].name,
    jn: newArr,
    users: users,
    helper: helper
  })
})