const Joi = require("joi");
const express = require("express");
const app = express();

app.use(express.json());

const agents = [
  {
    role:'Initator',
    name:'Sova',
    id:1
  },{
    role:'Duelists',
    name:'Raze',
    id:2
  },{
    role:'Sentinal',
    name:'Chamber',
    id:3
  }
];

app.get('/api/agents',(req,res) => {
  res.send(agents);
});

app.post('/api/agents',(req,res) => {
   const { error } = validateAgent(req.body); 
  if (error) return res.status(400).json(error);
  const agent = {
    role:req.body.role,
    name:req.body.name,
    id:agents.length + 1
  };

  agents.push(agent);
  res.send(agent);
})

app.get('/api/agents/:id', (req,res) => {
  const agent = agents.find((e) => e.id === parseInt(req.params.id));
  if(!agent) return res.status(404).send("The agent does not exist");
  res.send(agent);
})

app.delete('/api/agents/:id', (req,res) => {
  const agent = agents.find( e => e.id === parseInt(req.params.id));
  if(!agent) return res.status(404).send("The agent does not exist");
  const index = agents.indexOf(agent);
  agents.splice(index,1);
  res.send(agent);
})

app.put('/api/agents/:id', (req,res) => {
  const agent = agents.find( c => c.id === parseInt(req.params.id));
  if(!agent) return res.status(404).send("The agent does not exist");
  const {error} = validateAgent(req.body);
  if(error) return res.status(400).json(error);
  agent.role = req.body.role;
  agent.name = req.body.name;
  res.send(agent);
})

function validateAgent(agent){
  const schema = Joi.object().keys({
    name: Joi.string().min(4).required(),
    role:Joi.string().required()
  });
  return schema.validate(agent);
}

const port = process.env.PORT || 3000;
app.listen(port,() => console.log(`Listening to port ${port}`));
