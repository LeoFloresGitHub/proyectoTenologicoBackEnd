
const { pool } = require('../conexion.js');

//ASYNC AWAIT PORQUE ESTAS PETICIONES SON ASYNCRONOS
module.exports.getEquipos = async (req,res)=>{
    
    //const usuario = req.usuario;
    try {
        const [rows] = await pool.query('Select * from equipos')
        var rowsNew = []
        var i=0
        while(i< rows.length){
            
            const apodos = JSON.parse(rows[i].apodo) 
            var nuevoJsonObject = {
            id: rows[i].id,
            nombre: rows[i].nombre,
            fundacion: rows[i].fundacion,
            titulos: rows[i].titulos,
            ultimotitulo: rows[i].ultimotitulo,
            descensos: rows[i].descensos,
            apodo: apodos,
            estadio: rows[i].estadio,
            imagen:rows[i].imagen
          }
          rowsNew.push(nuevoJsonObject)
            i = i+1
        }
       
        

        res.json(rowsNew)
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: 'Something goes wrong'
    })
    }       
}

module.exports.getEquiposId = async (req,res)=>{
    try {
        const {id} = req.params
        const [row] = await pool.query('Select * from equipos where id = ?',[id]) 
        const apodos = JSON.parse(row[0].apodo) 
        const nuevoJsonObject = {
            id: row[0].id,
            nombre: row[0].nombre,
            fundacion: row[0].fundacion,
            titulos: row[0].titulos,
            ultimotitulo: row[0].ultimotitulo,
            descensos: row[0].descensos,
            apodo: apodos,
            estadio: row[0].estadio,
            imagen: row[0].imagen
          }
    
        if(Object.entries(row).length === 0){
        return res.status(500).json({
            message: 'Id Invalid'
        })}
        else 
        res.json(nuevoJsonObject)
        

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            
            message: 'Something goes wrong'
    })
    }
}


module.exports.postEquipos = async (req,res)=>{
    try {
        const {nombre,fundacion,titulos,ultimotitulo,descensos,apodo,estadio} = req.body
        const [result] = await  pool.query('Insert into equipos(nombre,fundacion,titulos,ultimotitulo,descensos,apodo,estadio) values (?,?,?,?,?,?,?)', [nombre,fundacion,titulos,ultimotitulo,descensos,apodo,estadio])
        
        res.send({
            id: result.insertId,
            nombre
        }) 
    } catch (error) {
        return res.status(500).json({
            message: 'No se inserto equipo'
    })
    }       
}


module.exports.patchEquipos = async (req,res)=>{
    try {
        const {id} = req.params
        const {nombre,fundacion,titulos,ultimotitulo,descensos,apodo,estadio} = req.body
        const [result] = await pool.query('Update equipos set nombre = IFNULL(?,nombre), fundacion = IFNULL(?,fundacion), titulos = IFNULL(?,titulos), ultimotitulo = IFNULL(?,ultimotitulo), descensos = IFNULL(?,descensos), apodo = IFNULL(?,apodo), estadio = IFNULL (?,estadio) where id = ?',[nombre,fundacion,titulos,ultimotitulo,descensos,apodo,estadio,id])
        if(result.affectedRows === 0)
        return res.status(404).json({message: "No se edito correctamente"})

        const [rows] = await pool.query('Select * from equipos where id = ?',[id])
        
        res.json(rows[0])
    } catch (error) {
        return res.status(500).json({
            message: 'No se realizó edición'
    })
    }       
}
module.exports.deleteEquipos = async (req,res)=>{
    try {
        const {id} = req.params
        const [result] = await pool.query('Delete from equipos where id = ?',[id])
        

        if(result.affectedRows <= 0){
            return res.status(404).json({message: "No se encontro equipo a eliminar"})
        }else{res.json({message: "Se elimino correctamente"})}
        
    } catch (error) {
        return res.status(500).json({
            message: "No se eliminó correctamente"
    })
    }       
}
