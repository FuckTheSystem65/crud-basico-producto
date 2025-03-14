const express=require("express");
const mysql=require("mysql");
const cors=require("cors");
const path=require("path");
const { resourceLimits } = require("worker_threads");
const { dir } = require("console");
const { constrainedMemory } = require("process");
const { json } = require("stream/consumers");

const app=express();
const port=3000;

app.use(express.json());
app.use(cors());






//conectarse a la base de datos mysql

const db=mysql.createConnection({
	host:"127.0.0.1",
	user:"root",
	password:"123",
	database:"pruebas"
});

//conectarse
db.connect(err=>{
	if(err){
		console.log("Error al conectar a la base de datos",err);
	}else{
		console.log("conectado a la base de datos MYSQL");
	}
});


// Servir archivos estáticos desde la carpeta "src"
app.use(express.static(path.join(__dirname)));


//ruta principal o incial
app.get("/",(request,response)=>{
    response.sendFile   (path.join(__dirname,"index.html"));
});



//obtener todos los productos;
app.get("/productos",(request,response)=>{
	db.query(
		"SELECT * FROM products",(error,results)=>{
			if(error){
				response.status(500).json({error: error.message});
			}else{
				response.json(results);
			}
		}
	);
});

//Obtener un producto por su id;
app.get("/productos/:id",(request,response)=>{
	const id=request.params.id;
	db.query(

		"SELECT * FROM products WHERE  id_producto=?",[id],(error,results)=>{
			if(error){
				response.status(500).json({ error: error.message});
			}else if(results.length===0){
				response.status(404).json({ mensaje:"empleado no encontrado"});
			}else{
				response.json(results[0]);// devuelve el unico registro
			}
		});
});

//Agregar un nuevo producto
app.post("/productos",(request,response)=>{
	const {codigo_barras, nombre,descripcion,precio_compra,precio_venta,stock,stock_minimo,unidad_de_medida,estado,imagen}=request.body;

	if(!codigo_barras ||
		!nombre || 
		!descripcion ||
		!precio_compra ||
		!precio_venta ||
		!stock ||
		!stock_minimo ||
		!unidad_de_medida ||
		!estado ||
		!imagen){
		return response.status(400).json({mensaje:"Todos los campos son obligatorios"});
	}


	db.query(
		"INSERT INTO products(codigo_barras,nombre,descripcion,precio_compra,precio_venta,stock,stock_minimo,unidad_de_medida,imagen, estado) values(?,?,?,?,?,?,?,?,?,?)",
		[codigo_barras,nombre,descripcion,precio_compra,precio_venta,stock,stock_minimo,unidad_de_medida,imagen,estado],
		(error,results)=>{
			if(error){
				response.status(500).json({ error: error.message});
			}else{
				response.status(201).json({ mensaje: "Empleado agregado",id: results.insertId});
				console.log(response.json);
			}
		});


});

//Actualizar empleado por su id;
app.put("/productos/:id",(request,response)=>{
	const  id_producto=request.params.id;
	const {codigo_barras,nombre,descripcion,precio_compra,precio_venta,stock,stock_minimo,unidad_de_medida,imagen,estado}=request.body;
	if(!codigo_barras ||
		!nombre || 
		!descripcion ||
		!precio_compra || 
		!precio_venta ||
		!stock ||
		!stock_minimo ||
		!unidad_de_medida ||
		!imagen ||
		!estado
	){
		return response.status(400).json({ mensaje:"Todos los campos son obligatorios"});
	}

	db.query(
		"UPDATE products  SET codigo_barras=?, nombre=?, descripcion=?, precio_compra=?, precio_venta=?, stock=?,  stock_minimo=?, unidad_de_medida=?, imagen=?, estado=? WHERE  id_producto=?",
		[codigo_barras,nombre,descripcion,precio_compra,precio_venta,stock,stock_minimo,unidad_de_medida,imagen, estado,  id_producto],
		(error,results)=>{
			if(error){
				response.status(500).json({ error: error.message});
			}else if(results.affectedRows===0){
				response.status(401).json({ mensaje:"Producto no encontrado"});
			}else{
				response.json({ mensaje:"Producto actualizado correctamente"});
			}
		}
	);

});


//Eliminar empleado por su id;
app.delete("/productos/:id",(request,response)=>{
	const id=request.params.id; //obtener el id de la url
	db.query
	("DELETE FROM products WHERE  id_producto=?",[id],(error,results)=>{
		if(error){
			response.status(500).json({ error: error.message});
		}else if(results.affectedRows===0){
			response.status(404).json({mensaje:"Producto no encontrado"});
		}else{
			response.json({ mensaje:"producto eliminado correctamente"});
		}
	});
	
});






app.listen(3600,"0.0.0.0",()=>{
	console.log("server running on http://localhost:3600");
});