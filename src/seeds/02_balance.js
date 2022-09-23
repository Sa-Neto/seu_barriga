exports.seed = (knex) => {
return knex('users').insert([
    { id: 10100, name: 'User #3', mail: 'user3@mail.com', passwd: '$2a$10$yazvL84b764nmk9/DE4yLeKGaQLOR3Qv4sKq9o9Q63g3MmE6Jl57K'},
    { id: 10101, name: 'User #4', mail: 'user4@mail.com', passwd: '$2a$10$yazvL84b764nmk9/DE4yLeKGaQLOR3Qv4sKq9o9Q63g3MmE6Jl57K'}
  ])
    .then(() => knex('accounts').insert([
      { id: 10100, name: 'Acc Saldo Principal', user_id: 10100 },  
      { id: 10101, name: 'AccD Saldo Secundário', user_id: 10100 },  
      { id: 10102, name: 'Acc Alternativo 1', user_id: 10101 },  
      { id: 10103, name: 'Acc Alternativo 2', user_id: 10101 }, 
    ]))
};
