const express = require('express');
const cors = require('cors');
const app = express();
const port = 3010
const db = require('./database');

app.use(express.json());
app.use(cors());


// barang
app.get('/api/barang',(req,res)=> {
    const url = `SELECT * FROM barang`;
    db.query(url,(error,result) => {
        if(error) return res.status(500).json({message : "data not found", data : error});
        res.status(200).json({
            message: "Data Success",
            data : result
        })
    })
})

// create
app.post('/api/barang',(req,res) => {
    const {nama_barang, jumlah_barang, harga_barang} = req.body;
    const url = `INSERT INTO barang(nama_barang, jumlah_barang, harga_barang) VALUES (?,?,?)`;
    db.query(url,[nama_barang,jumlah_barang,harga_barang],(error,result) => {
        if(error) return res.status(500).json({message : "data error", data : error});
        res.status(201).json({
            message: "Data add Success",
            data : {
                id_barang : result.insertId,
                nama_barang,
                jumlah_barang,
                harga_barang
            }
        })
    })
})

// edit 
app.put('/api/barang/:id',(req,res) => {
    const id_barang = Number(req.params.id);
    const {nama_barang,jumlah_barang,harga_barang} = req.body;
    const url = `UPDATE barang SET nama_barang = ? ,jumlah_barang = ?,harga_barang = ? WHERE id_barang = ?`
    db.query(url,[nama_barang,jumlah_barang,harga_barang,id_barang], (error,result) => {
        if(error) return res.status(500).json({message : "data error", data : error});

        if(result.affectedRows === 0) {
            return res.status(404).json({message : "data not found"})
        }

        res.status(200).json({
            message: "Data Update Success",
            data : {
                id_barang,
                nama_barang,
                jumlah_barang,
                harga_barang
            }
        })
    })
})

// delete
app.delete('/api/barang/:id',(req,res) => {
    const id_barang = Number(req.params.id);
    const url = `DELETE FROM barang WHERE id_barang = ?`;
     db.query(url,[id_barang], (error,result) => {
        if(error) return res.status(500).json({message : "data error", data : error});

        if(result.affectedRows === 0) {
            return res.status(404).json({message : "data not found"})
        }

        res.status(200).json({
            message: "Data Deleted Success",
        })
    })
})

app.listen(port,'0.0.0.0',() => {
    console.log(`server port ${port}`)
})