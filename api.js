const jwt = require('jsonwebtoken');
const SECRET_KEY = 'supersecreto1234'; // Cambiar por una clave fuerte y almacenarla en un entorno seguro
const TOKEN_EXPIRATION = '1h'; // El token expirará en 1 hora
const http = require('http');
const { Pool } = require('pg'); // Importar el cliente pg

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
    user: 'postgres',       // Tu usuario de PostgreSQL
    host: 'localhost',        // Dirección de tu servidor PostgreSQL
    database: 'test',     // Nombre de tu base de datos
    password: '1234',// Contraseña de tu usuario
    port: 5432,               // Puerto por defecto de PostgreSQL
});

const server = http.createServer(
	function(request,response){	
	let body = '';
	request.on('data', chunk => {
        body += chunk.toString(); // convert Buffer to string
    });
    request.on('end', async () => {
			var action;
        	response.setHeader('Access-Control-Allow-Origin', '*');
			response.setHeader('Access-Control-Request-Method', '*');
			response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, DELETE');
			response.setHeader('Access-Control-Allow-Headers', '*');
		//Request para comprobar el login	
		if(request.url=="/login" && request.method=='POST'){
			let cuenta = JSON.parse(body);
			var resLogin = await consultaLogin(cuenta.user,cuenta.pass);
			if (resLogin){
				const token = jwt.sign({ user: cuenta.user }, SECRET_KEY, { expiresIn: TOKEN_EXPIRATION });
				response.writeHead(200, { 
					'Content-Type': 'application/json', 
					'Access-Control-Allow-Origin': '*' 
				  });
				response.end(JSON.stringify({ token })); // Devolver el token al cliente
			}else{
				response.writeHead(401);
				response.end();
			}
		}
		//Request para mostrar la tabla users
		if(request.url=="/users" && request.method=='GET'){
			// console.log('users');
			// const verified = verifyToken(request);
			// if (!verified) {
			// 	response.writeHead(401, { 'Content-Type': 'application/json' });
			// 	response.end(JSON.stringify({ error: 'Token no válido o no proporcionado' }));
			// 	return;
   			// }else{
				var resTabla = await consultaTabla();
				response.writeHead(200,{'Content-Type':'application/json'});
				response.end(JSON.stringify(resTabla));	
			//}
			
		}
		//Request para añadir usuario
		if(request.url=="/add" && request.method=='POST'){
			console.log('add');
			let newUser = JSON.parse(body);
			//Declaramos la variable action a 0 para añadir usuario
			action=0;
			var add = await updateTable(newUser.user,newUser.pass,action);
			response.writeHead(200,{'Content-Type':'application/json'});
			response.end(JSON.stringify(add));
		}
		//Request para borrar usuario
		if(request.url=="/del" && request.method=='DELETE'){
			console.log('del');
			let delUser = JSON.parse(body);
			//Declaramos la variable action a 1 para borrar usuario
			action=1;
			var del = await updateTable(delUser.user,delUser.pass,action);
			response.writeHead(200,{'Content-Type':'application/json'});
			response.end(JSON.stringify(del));
		}
		//Request para modificar usuario
		if(request.url=="/alter" && request.method=='PUT'){
			console.log('alter');
			let alterUser = JSON.parse(body);
			
			var del = await alterTable(alterUser.user,alterUser.pass,alterUser.newUser,alterUser.newPass);
			response.writeHead(200,{'Content-Tyspe':'application/json'});
			response.end(JSON.stringify(del));
		}
		if(request.method=='OPTIONS'){
			response.end();
		}

    });
	}
);
const port = 3000;
server.listen(port, () => { 
	console.log('running'); 
});
async function consultaLogin(user,pass) {
	try {
	const query = 'select name,pass from persons where name=\''+user+'\' and pass=\''+pass+'\'';
	var cons = await pool.query(query);
	if (cons.rowCount==1){
		return true;
	}else{
		return false;
	}
	} catch (err) {
	console.error(err);
	console.error('Query failed');
	return false;
	}
}
async function consultaTabla() {
	const query = 'select * from persons;';
	var cons = await pool.query(query);
	return cons.rows;
}
function updateTable(user,pass,action) {
	switch(action){
		case 0:
			var query = 'insert into persons(personid,name,pass) values(5,\''+user+'\',\''+pass+'\')';
		break;
		case 1:
			var query = 'delete from persons where name=\''+user+'\' and pass=\''+pass+'\'';
		break;
			default:
	}
	pool.query(query);
	let newQuery = consultaTabla();
	return newQuery;
}
function alterTable(user,pass,newUser,newPass) {
	const query = ' update persons set name=\''+newUser+'\',pass=\''+newPass+'\' where name=\''+user+'\' and pass=\''+pass+'\'';
	pool.query(query);
	let newQuery = consultaTabla();
	return newQuery;
}
function verifyToken(request) {
    const authHeader = request.headers['authorization'];
    if (!authHeader) return null;

    const token = authHeader.split(' ')[1]; // Separa el Bearer del token
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        return decoded; // Información decodificada del token
    } catch (err) {
        return null; // Token no válido
    }
}