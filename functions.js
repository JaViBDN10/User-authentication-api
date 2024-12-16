localStorage.clear();
const routes = {
	'/': `
		<h1>Portal Tecnológico</h1>
		
		<div id="login"><br>
			<label>User</label>
			<input id="user" value="javier"></input><br>
			<label>Pass</label>
			<input id="pass" value="1234"></input><br>
			<input  class="my-button" type="button" value="login" onclick="loginApi()"><br><br>
		</div>`,
	'/user': `<div id="divMain">
				<div class="sideBar">
				<div id="buttons">
				</div>
			</div>
			<div id="table" class="table-wrapper">
			<h2>Tabla Usuarios</h2>
			<table class="fl-table">
				<thead>
					<tr class="table-header">
						<th scope="col">User ID</th>
						<th scope="col">Name</th>
						<th scope="col">Password</th>
					</tr>
				</thead>
				<tbody id="table_body" class="table-row">
				</tbody>
			</table>
			<div id="addButtons">	
				</div>
			</div>
			</div>`
};
 // Renderizar el contenido de la página basado en la URL
 function renderPage(path) {
	const content = routes[path] || '<h1>404 - Página no encontrada</h1>';
	document.getElementById('main').innerHTML = content;
}

// //Detectar cambios en la URL cuando el usuario usa "atrás" o "adelante"
// navigation.addEventListener('navigate', () => {	
// 	//alert(window.location.pathname);
// 	//renderPage(window.location.pathname);
// 	renderPage('/user'); 
// 	showTable(); 
// });

// // Cargar la página correcta cuando se recarga
// window.addEventListener('popstate', () => {
// 	//alert('refresh popstate');
// 	renderPage('/user'); 
// 	//renderPage(window.location.pathname);
// });
// Cargar la página correcta cuando se recarga
window.addEventListener('load', () => {
	//alert('refresh load');
	renderPage(window.location.pathname);
});
// window.addEventListener('hashchange', () => {
// 	renderPage(window.location.pathname);
// });
// // Cambiar la vista y la URL usando pushState
// function navigateTo(path) {
// 	history.pushState(null, '', path);
// 	renderPage(path);
// }
const dominio = "http://localhost:3000/";
function getUser(){
			var user = document.getElementById('user').value;
			return user;
}
function getPass(){
			var pass = document.getElementById('pass').value;
			return pass;
}
async function loginApi(){
	var user= getUser();
	//var userLogin=user;
	var pass= getPass();
	await fetch(dominio+'login',{
		method:'POST',
		mode: 'cors',
		body: JSON.stringify({
			user:user,
			pass:pass
		})
	})
	window.history.pushState(null, '', '/user');
	renderPage('/user');
	showTable();
	// .then(resp => {
	// 	// Guardar el status de la respuesta antes de convertirla en JSON
	// 	const status = resp.status; 
	// 	return resp.json().then(data => ({ status, data })); // Devuelve un objeto con status y data
	// })
	// .then(({ status, data }) => {
	// 	if (status === 200) {
	// 		localStorage.setItem('token', data.token); // Guarda el token en localStorage
	// 		window.history.pushState(null, '', '/user'); 
	// 		renderPage('/user'); 
	// 		//showTable();
	// 	} else {
	// 		alert('Usuario o contraseña incorrectos');
	// 		document.getElementById('user').value = '';
	// 		document.getElementById('pass').value = '';
	// 	}
	// })
	// .catch(error => alert('wtf'))
}

async function showTable(){
	await fetch(dominio+'users',{
		method:'GET',
		mode: 'cors',
		headers: {
			//'Authorization': `Bearer ${localStorage.token}`, // Aquí se envía el token
			'Content-Type': 'application/json'
		}
	})
	.then(resp => resp.json())
	.then(data =>{
		// if(data.status=='401'){
		// 	renderPage('/');
		// }else{
		document.getElementById("buttons").innerHTML='';
		let tableData="";
		data.map((values)=>{
			
			tableData+=`<tr>
							<td>${values.personid}</td>
							<td>${values.name}</td>
							<td>${values.pass}</td>
						</tr>`;	
		});
		document.getElementById("table_body").innerHTML=tableData;
		document.getElementById("buttons").innerHTML+=`<div id="login"><br>
					<input class="my-button" type="button" value="Añadir Usuario" onclick="addUserMenu()"><br>
					<input class="my-button" type="button" value="Borrar Usuario" onclick="deleteUserMenu()"><br>
					<input class="my-button" type="button" value="Modificar Usuario" onclick="alterUserMenu()"></div>`;
	
		}
		//}	
)}
function addUserMenu(){
	document.getElementById("addButtons").innerHTML='';
	document.getElementById("addButtons").innerHTML+=`<div class="nuevo" id="add"><br>
	<label class="newLabel">Nuevo Usuario</label>
	<input id="newUser"></input><br>
	<label class="newLabel">Password</label>
	<input id="newPass"></input><br>
	<input class="my-button" type="button" value="Añadir" onclick="addUser()">
	</div>`;
}
function deleteUserMenu(){
	document.getElementById("addButtons").innerHTML='';
	document.getElementById("addButtons").innerHTML+=`<div class="nuevo" id="add"><br>
	<label class="newLabel">Nuevo Usuario</label>
	<input id="delUser"></input><br>
	<label class="newLabel">Password</label>
	<input id="delPass"></input><br>
	<input class="my-button" type="button" value="Borrar" onclick="delUser()">
	</div>`;
}
function alterUserMenu(){
	document.getElementById("addButtons").innerHTML='';
	document.getElementById("addButtons").innerHTML+=`<div class="nuevo" id="add"><br>
	<label class="newLabel">Modificar Usuario</label>
	<input id="delUser"></input><br>
	<label class="newLabel">Password</label>
	<input id="delPass"></input><br>
	<label class="newLabel">Nuevo nombre</label>
	<input id="alterUser"></input><br>
	<label class="newLabel">Nuevo password</label>
	<input id="alterPass"></input><br>
	<input class="my-button" type="button" value="Modificar" onclick="alterUser()">
	</div>`;
}
async function addUser() {
	
	var user = document.getElementById('newUser').value;
	var pass = document.getElementById('newPass').value;
	document.getElementById("addButtons").innerHTML='';
	await fetch(dominio + 'add', {
		method: 'POST',
		mode: 'cors',
		body: JSON.stringify({ user: user, pass: pass })
	})
	.then(resp => {
		if(resp.status==200){
			alert('usuario añadido');
			showTable();
		}else{
			alert('Error al añadir usuario');
		}})
}
async function delUser() {
	var user = document.getElementById('delUser').value;
	var pass = document.getElementById('delPass').value;
	document.getElementById("addButtons").innerHTML='';
	await fetch(dominio + 'del', {
		method: 'DELETE',
		mode: 'cors',
		body: JSON.stringify({ user: user, pass: pass })
	})
	.then(resp => {
		if(resp.status==200){
			alert('usuario añadido');
			showTable();
		}else{
			alert('Error al añadir usuario');
		}})
}
async function alterUser() {
	var user = document.getElementById('delUser').value;
	var pass = document.getElementById('delPass').value;
	var newUser = document.getElementById('alterUser').value;
	var newPass = document.getElementById('alterPass').value;
	document.getElementById("addButtons").innerHTML='';
	await fetch(dominio + 'alter', {
		method: 'PUT',
		mode: 'cors',
		body: JSON.stringify({ user: user, pass: pass,newPass: newPass,newUser: newUser })
	})
	.then(resp => {
		if(resp.status==200){
			alert('usuario modificado');
			showTable();
		}else{
			alert('Error al añadir usuario');
		}})
}

