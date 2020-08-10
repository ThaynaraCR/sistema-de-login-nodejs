
const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});


/*exports.login = async (req, res) =>{
    try{
        const {email, password} = req.body;
        if( !email || !password){
            return res.status(400).render('login', {
            message: 'Please provide an email valid' 
            })
        }
    
       /* db.query('SELECT * FROM usuarios WHERE email = ? ', [email],   async (error, results) => {
            console.log(results);
          if (!results || !(await compare(password, results[0].senha))){
                 res.status(401).render('login', {
                    message: 'Email or password is incorrect'
                }) 
            }else{
                const id = results[0].id;
                const token = jwt.sign({ id}, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });

                console.log("The token is:" + token);
                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60
                    ),
                    httpOnly: true
                }

                res.cookie('jwt', token, cookieOptions);
                res.status(200).redirect("/");
            }
        })
        
    
    }catch(error){
        console.log(error);
    }
}
*/


exports.register = (req, res) => {
    console.log(req.body);

    const {name, email, password, passwordConfirm}= req.body;
    
    db.query('SELECT email FROM usuarios WHERE email = ?',[email], async (error, results )=>{
        if (error){
            console.log(error);
        }

        if(results.length > 0){
            return res.render('register',{
                message: 'That email is alredy in use'
            })
        }else if(password !== passwordConfirm){
             return res.render("register", {
               message: "The password do not match",
             });
        }

        let hashedPassword = await bcrypt.hash(passwordConfirm, 8);
        console.log(hashedPassword);
        db.query('INSERT INTO usuarios SET ?', {nome: name, email: email, senha:hashedPassword}, (error, results)=> {
            if (error){
                console.log(error);
            }else{
                return res.render("register", {
                  message: "Usuário registrado!",
                });
            }
        })
    });
}