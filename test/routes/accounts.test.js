const request = require('supertest');
const app = require('../../src/app');
const jwt = require('jwt-simple')
const MAIN_ROUTE = '/v1/accounts'

let user 
let user2 

beforeAll(async () => {
    const res = await app.services.user.save({name:'User Account',mail:`${Date.now()}@mail.com`,passwd:'123456'})
    user = {...res[0]};
    user.token = jwt.encode(user,'Segredo!')

    const res2 = await app.services.user.save({name:'User Account #2',mail:`${Date.now()}@mail.com`,passwd:'123456'})
    user2 = {...res2[0]};
});

test('Deve listar apenas as contas do usuario',() => {
    return app.db('accounts').insert([
        {name:'Acc User #1',user_id:user.id},
        {name:'Acc User #2',user_id:user2.id},
    ]).then(() => request(app).get(MAIN_ROUTE)
        .set('authorization',`bearer ${user.token}`)
        .then((res) => {
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(1);
            expect(res.body[0].name).toBe('Acc User #1')
        })) 
})

test('Deve inserir um const com sucesso',() => {
    return request(app).post(MAIN_ROUTE)
        .send({name:'Acc #1'})
        .set('authorization',`bearer ${user.token}`)
        .then((result) => {
            expect(result.status).toBe(201)
            expect(result.body.name).toBe('Acc #1');
        })
})

test('Não deve inserir uma conta sem nome',() => {
    return request(app).post(MAIN_ROUTE)
        .send({})
        .set('authorization',`bearer ${user.token}`)
        .then((result) => {
            expect(result.status).toBe(400)
            expect(result.body.error).toBe('Nome é um atributo obrigatório')
        })
})

// test('Deve listar todoas as contas',() => {
//     return app.db('accounts')
//         .insert({name:'Acc list', user_id:user.id})
//         .then(() => request(app).get(MAIN_ROUTE).set('authorization',`bearer ${user.token}`))
//         .then((res) => {
//             expect(res.status).toBe(200);
//             expect(res.body.length).toBeGreaterThan(0)
//         })
//     })



test('Deve retornar uma conta por Id' ,() => {
    return app.db('accounts')
        .insert({name:'Acc By Id',user_id:user.id} ,['id'])
        .then(acc => request(app).get(`${MAIN_ROUTE}/${acc[0].id}`).set('authorization',`bearer ${user.token}`))
        .then((res) => {
            expect(res.status).toBe(200);
            expect(res.body.name).toBe('Acc By Id');
            expect(res.body.user_id).toBe(user.id)
        })
})

test('Deve alterar uma conta',() => {
    return app.db('accounts')
        .insert({name:'Acc to Upgrate', user_id:user.id},['id'])
        .then(acc => request(app).put(`${MAIN_ROUTE}/${acc[0].id}`)
            .send({name:'Acc Updated'})
            .set('authorization',`bearer ${user.token}`)
            )
        .then((res) => {
            expect(res.status).toBe(200);
            expect(res.body.name).toBe('Acc Updated')
        })
})
test('Deve remover uma conta',() => {
    return app.db('accounts')
        .insert({name:'Acc to remove',user_id:user.id},['id'])
        .then(acc => request(app).delete(`${MAIN_ROUTE}/${acc[0].id}`)
        .set('authorization',`bearer ${user.token}`))
        .then((res) => {
            expect(res.status).toBe(204)
        })
})