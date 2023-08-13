const { Dose } = require('./models/');

async function randomlyTakeDoses() {
    let doses = await Dose.find({ user: '64d47c661806b140baabaf0c'});
    // console.log(doses.length);
    
    for (let i = 0; i < doses.length; i++) {
        const random = Math.random();
        if (random > 0.5) {
            doses[i].taken = true;
            await doses[i].save();
        }
    }

    for (let i = 0; i < doses.length; i++) {
        console.log(doses[i].taken);
    }
}

randomlyTakeDoses();