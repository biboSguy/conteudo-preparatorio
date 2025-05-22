/*
importar o express primeira linha
abrir o servidor ultima linha
incializar o servidor linha 28
criar uma rota simples e ver se ela esta funcionando linha 32 e 36
apartir disso coisas extras na  seguinte ordem:
listar uma tarefa, criar uma tarefa, atualizar tarefa, deletar uma tarefa, ler aquivos, atualizar arquivos.


*/
import express from 'express'
import fs from 'fs'

/* const express = require('express')
  atualizar o package.json se utilizar import express from 'express', adicionando
  "type": "module"
*/

/* servidor pode ser inicializado com "node (nome de arquivo [server.js])",
  para o servidor atualizar as mudanças no código automaticamente, nodemon deve estar
  inicializado no start (que também deve ser criado no arquivo package.json), e 
  o comando se torna "node start"
*/

//linha 23 -> caminho, transformação, callback

//Inicializando o Servidor.
const server = express()
server.use(express.json())

//criar uma rota simples
server.options('/', (req, res)=>{
    res.status(200).json({msg:"Tudo Ok"})
    //Pode ser usado send em vez de json, e vice versa.
})
//se tiver um problema no codigo ele da erro 500 se estiver tudo certo ele da 200
server.get('/tarefas', (req, res)=> {
    fs.readFile('./banco.json', 'utf-8', (err, data) =>{
        if(err){
            res.status(500).json({erro:err})
        } else {
            const tarefas = JSON.parse(data)
            res.status(200).json(tarefas)
        }
    })
})

//listar UMA tarefa especifica, caso nao existir, retornar 404
server.get('/tarefas/:id', (req, res)=> {
    const tarefa_id = req.params.id
    fs.readFile('./banco.json', 'utf-8', (err, data) =>{
        if(err){
            res.status(500).json({erro:err})
        } else {
            const lista_de_tarefas = JSON.parse(data)
            const tarefa = lista_de_tarefas.find((tarefa) => tarefa.id == tarefa_id)
            if (!tarefa) {
                res.status(404).json({err: "Item não encontrado!"})
            } else {
                res.status(200).json(tarefa)
            }
        }
    })
})

//criar uma tarefa
server.post('/tarefas', (req, res) => {
    const {titulo, descricao, dificuldades, user_id} = req.body
    //pegar as informações da nova tarefa, do body da requisição

    //lendo meu arquivo (readFile)
    fs.readFile('./banco.json', 'utf-8', (err, data) => {
        if(err){
            res.status(500).json({erro:err})
        } else {
            const lista = JSON.parse(data)
            const novaTarefa = {
                id: Date.now().toString(), // cria um ID único com timestamp
                titulo,
                descricao,
                dificuldades,
                user_id
            }

            //inserir a nova tarefa no arquivo
            lista.push(novaTarefa)

            //salvar o arquivo (writeFile)
            fs.writeFile('./banco.json', JSON.stringify(lista, null, 2), (err) => {
                if(err){
                    res.status(500).json({erro:err})
                } else {
                    res.status(201).json(novaTarefa)
                }
            })
        }
    })
})

//atualizar uma tarefa
//Professor
/*
server.put('/tarefas/:id', (req, res) =>{
    const id = parseInt(req.params.id)
    let cod_err = 200
    let msg = 'Atualizado com sucesso'
    fs.readFile('./banco.json', 'utf-8', (err, data) =>
        if (err){
    res.status(503). json({erro: err})
    }
    const lista_de_tarefas = JSON.parse(data)
    const tarefa_index = lista_de_tarefas.findIndex((item) => item.id
    if (tarefa_index == -1) {
    } else {

    }))})
*/

//lendo tarefa
//Tentando
server.put('/tarefas/:id', (req, res) => {
    const tarefa_id = req.params.id
    const {titulo, descricao, dificuldades, user_id} = req.body

    fs.readFile('./banco.json', 'utf-8', (err, data) => {
        if(err){
            res.status(500).json({erro:err})
        } else {
            let lista = JSON.parse(data)
            const index = lista.findIndex(t => t.id == tarefa_id)

            if(index === -1){
                res.status(404).json({erro: "Tarefa não encontrada"})
            } else {
                // atualizar os dados
                lista[index] = {
                    ...lista[index],
                    titulo,
                    descricao,
                    dificuldades,
                    user_id
                }

                fs.writeFile('./banco.json', JSON.stringify(lista, null, 2), (err) => {
                    if(err){
                        res.status(500).json({erro:err})
                    } else {
                        res.status(200).json(lista[index])
                    }
                })
            }
        }
    })
})

//deletar uma tarefa
server.delete('/tarefas/:id', (req, res) => {
    const tarefa_id = req.params.id

    fs.readFile('./banco.json', 'utf-8', (err, data) => {
        if(err){
            res.status(500).json({erro:err})
        } else {
            let lista = JSON.parse(data)
            const novaLista = lista.filter(t => t.id != tarefa_id)

            if(lista.length === novaLista.length){
                res.status(404).json({erro: "Tarefa não encontrada"})
            } else {
                fs.writeFile('./banco.json', JSON.stringify(novaLista, null, 2), (err) => {
                    if(err){
                        res.status(500).json({erro:err})
                    } else {
                        res.status(204).send()
                    }
                })
            }
        }
    })
})

//Função ler arquivos
function ReadFile(file) {
    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf-8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                try {
                    const parsedData = JSON.parse(data);
                    resolve(parsedData);
                } catch (parseError) {
                    reject(parseError);
                }
            }
        });
    });
}


//Função escrever arquivos

WriteFile('./banco.json', lista)
    .then(() => {
        console.log("File written successfully!");
    })
    .catch((err) => {
        console.error("Error writing to file", err);
    });



//mandar o servidor ouvir na porta 8000.
server.listen(8000, () => {
    console.log('Servidor rodando na porta 8000') //importante não esquecer também
})