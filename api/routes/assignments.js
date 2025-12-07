let Assignment = require("../model/assignment");

function getAssignments(req, res) {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;

  const aggregateQuery = Assignment.aggregate(); 
  const options = { page, limit, sort: { id: 1 } };

  Assignment.aggregatePaginate(aggregateQuery, options, (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result); 
  });
}

// Récupérer un assignment par son id (GET)
function getAssignment(req, res){
  const assignmentId = Number(req.params.id);

  Assignment.findOne({ id: assignmentId }, (err, assignment) => {
    if (err) return res.status(500).send(err);
    if (!assignment) return res.status(404).json({ message: "Not found" });
    res.json(assignment);
  });
}


// Ajout d'un assignment (POST)
function postAssignment(req, res){
    let assignment = new Assignment();
    assignment.id = req.body.id;
    assignment.nom = req.body.nom;
    assignment.dateDeRendu = req.body.dateDeRendu;
    assignment.rendu = req.body.rendu;

    console.log("POST assignment reçu :");
    console.log(assignment)

    assignment.save( (err) => {
        if(err){
            res.send('cant post assignment ', err);
        }
        res.json({ message: `${assignment.nom} saved!`})
    })
}

// Update d'un assignment (PUT)
function updateAssignment(req, res) {
    console.log("UPDATE recu assignment : ");
    console.log(req.body);
    Assignment.findByIdAndUpdate(req.body._id, req.body, {new: true}, (err, assignment) => {
        if (err) {
            console.log(err);
            res.send(err)
        } else {
          res.json({message: 'updated'})
        }

      // console.log('updated ', assignment)
    });

}

// suppression d'un assignment (DELETE)
function deleteAssignment(req, res) {
  const assignmentId = Number(req.params.id);

  Assignment.findOneAndDelete({ id: assignmentId }, (err, assignment) => {
    if (err) return res.status(500).send(err);

    if (!assignment) {
      return res.status(404).json({ message: `Assignment id=${assignmentId} not found` });
    }

    res.json({ message: `${assignment.nom} deleted` });
  });
}



module.exports = { getAssignments, postAssignment, getAssignment, updateAssignment, deleteAssignment };
