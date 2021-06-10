import express from "express"
import { json } from "body-parser"


const app = express()

app.use(json())

app.get('/api/users/me', (req, res) => {
    res.send("Hi there")
    console.log(req)
})

app.get('/', (req, res) => {
    res.send("HELLO THERE!")
    console.log("WADDUP")

})

app.listen(3000, () => {
    console.log("Listening on port 3000!!!")
})