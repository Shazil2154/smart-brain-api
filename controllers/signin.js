const handleSignin = (db, bcrypt) => (req, res) => { 
    const {email, password} = req.body;
    if( !email || !password){
        return res.status(400).json('incorrect form submittion');
    }
    db.select('email','hash').from('login')
    .where('email','=' , email)
    .then( data => {
        let isValid= false;
        bcrypt.compare(password, data[0].hash, function(err, result) {
                isValid = result;
                if( isValid ){
                    return db.select('*').from('users')
                    .where('email','=', email )
                    .then(user => {
                        res.json(user[0])
                    })
                    .catch( err => res.status(400).json('somthing went wrong'))
                }else{
                    res.status(400).json('wrong credentials')
                 }
        });
       
    })
    .catch( err => res.status(400).json('wrong credentials'))
}
module.exports = {
    handleSignin: handleSignin
}