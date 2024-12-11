const routes = {
	'/': `
		<h1>Portal Tecnológico</h1>
		
		<div id="login"><br>
			<label>User</label>
			<input id="user" value="javier"></input><br>
			<label>Pass</label>
			<input id="pass" value="1234"></input><br>
			<input  class="my-button" type="button" value="login" onclick="loginApi()"><br><br>
		</div>
		<div id="table" class="table-wrapper" hidden>
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
			<div id="buttons">

			</div>
		</div>`,
	'/user': `<div id="table" class="table-wrapper">
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
			<div id="buttons">

			</div>
		</div>`
};
 // Renderizar el contenido de la página basado en la URL
 function renderPage(path) {
	const content = routes[path] || '<h1>404 - Página no encontrada</h1>';
	document.getElementById('main').innerHTML = content;
}

// Detectar cambios en la URL cuando el usuario usa "atrás" o "adelante"
navigation.addEventListener('navigate', () => {	
	renderPage(window.location.pathname);
});

// Cargar la página correcta cuando se recarga
window.addEventListener('load', () => {
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
function loginApi(){
	var user= getUser();
	var pass= getPass();
	fetch(dominio+'login',{
		method:'POST',
		mode: 'cors',
		body: JSON.stringify({
			user:user,
			pass:pass
		})
	})
	.then(resp => {
		if (resp.status=='200'){
			window.history.pushState(null, '', '/user'); 
			showTable();
		}else{
			alert('Usuario o contraseña incorrectos');	
			document.getElementById('user').value='';
			document.getElementById('pass').value='';
		}
	})
}

async function showTable(){
	await fetch(dominio+'users',{
		method:'GET',
		mode: 'cors',
	})
	.then(resp => resp.json())
	.then(data =>{
		document.getElementById('main').innerHTML = '';
		//document.getElementById('buttons').innerHTML = '';
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
)}
function addUserMenu(){
	document.getElementById("buttons").innerHTML+=`<div class="nuevo" id="add"><br>
	<label class="newLabel">Nuevo Usuario</label>
	<input id="newUser"></input>
	<label class="newLabel">Password</label>
	<input id="newPass"></input>
	<input class="my-button" type="button" value="Añadir" onclick="addUser()">
	</div>`;
}
function deleteUserMenu(){
	document.getElementById("buttons").innerHTML+=`<div class="nuevo" id="add"><br>
	<label class="newLabel">Borrar Usuario</label>
	<input id="delUser"></input>
	<label class="newLabel">Password</label>
	<input id="delPass"></input>
	<input class="my-button" type="button" value="Borrar" onclick="delUser()">
	</div>`;
}
function alterUserMenu(){
	document.getElementById("buttons").innerHTML+=`<div class="nuevo" id="add"><br>
	<label class="newLabel">Modificar Usuario</label>
	<input id="delUser"></input>
	<label class="newLabel">Password</label>
	<input id="delPass"></input>
	<label class="newLabel">Nuevo nombre</label>
	<input id="alterUser"></input>
	<label class="newLabel">Nuevo password</label>
	<input id="alterPass"></input>
	<input class="my-button" type="button" value="Modificar" onclick="alterUser()">
	</div>`;
}
async function addUser() {
	
	var user = document.getElementById('newUser').value;
	var pass = document.getElementById('newPass').value;
	await fetch(dominio + 'add', {
		method: 'POST',
		mode: 'cors',
		body: JSON.stringify({ user: user, pass: pass })
	})
		showTable()
}
async function delUser() {
	var user = document.getElementById('delUser').value;
	var pass = document.getElementById('delPass').value;
	await fetch(dominio + 'del', {
		method: 'DELETE',
		mode: 'cors',
		body: JSON.stringify({ user: user, pass: pass })
	})
		showTable()
}
async function alterUser() {
	var user = document.getElementById('delUser').value;
	var pass = document.getElementById('delPass').value;
	var newUser = document.getElementById('alterUser').value;
	var newPass = document.getElementById('alterPass').value;
	await fetch(dominio + 'alter', {
		method: 'PUT',
		mode: 'cors',
		body: JSON.stringify({ user: user, pass: pass,newPass: newPass,newUser: newUser })
	})
		showTable()
}

