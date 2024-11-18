const express = require("express");
const router = express.Router();
const db = require("../database/bd");

router.get("/getPais", (req, res) => {
  const query = "SELECT * FROM pais";
  db.query(query, (err, suc) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(suc);
  });
});

// Rota para obter os estados com base no país
router.get("/getEstado/:paisId", (req, res) => {
  const paisId = req.params.paisId;
  const query = "SELECT * FROM estado WHERE idPais = ?";
  db.query(query, [paisId], (err, suc) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json(suc);
  });
});

// Rota para obter as cidades com base no estado
router.get("/getCidade/:estadoId", (req, res) => {
  const estadoId = req.params.estadoId;
  const query = "SELECT * FROM cidade WHERE idEstado = ?";
  db.query(query, [estadoId], (err, suc) => {
    if (err) return res.status(500).json({ error: err.message });
    
    res.json(suc);
  });
});

module.exports = router;
