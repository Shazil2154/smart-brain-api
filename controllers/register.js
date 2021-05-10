const handleRegister = ( db, bcrypt, saltRounds) => (req, res) => {
    const {name, email, password} = req.body;
    if(!email || !name || !password){
        return res.status(400).json('incorrect form submittion');
    }
    db.transaction(trx => {
        bcrypt.hash(password, saltRounds, function(err, hash) {
        if(!err){
            trx.insert({
                hash: hash,
                email: email
            })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                .returning('*')
                .insert({
                    email: loginEmail[0],
                    name: name,
                    joined: new Date()
                })
                .then(user => { 
                        res.json(user[0])
                    })

             })
             .then(trx.commit)
             .catch(trx.rollback)
        }
});
    })
      
    .catch(err => res.status(400).json(err.detail))
    
}
module.exports = {
    handleRegister: handleRegister
}